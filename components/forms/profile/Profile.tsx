import { useState } from 'react'

import dayjs from 'dayjs'
import { Field, FieldProps, Form, Formik } from 'formik'

import Icon from 'components/common/Icon'
import InputArea from 'components/common/InputArea'
import InputAutoComplete from 'components/common/InputAutoComplete'
import InputDate from 'components/common/InputDate'
import InputImage from 'components/common/InputImage'
import InputMultiText from 'components/common/InputMultiText'
import InputSelect from 'components/common/InputSelect'
import InputTags from 'components/common/InputTags'
import InputText from 'components/common/InputText'
import Loader from 'components/common/Loader'
import SelectButton from 'components/common/SelectButton'
import { useToast } from 'components/common/Toast'
import Tooltip from 'components/common/Tooltip'

import cn from 'util/classnames'
import { CITIES, TAGS_LIST } from 'util/constants'
import { getProfileIndex } from 'util/search'
import { useAppDispatch, useAppSelector } from 'util/store'
import { getDefaultAvailability } from 'util/time'
import { timezonesList } from 'util/timezone'
import Yup, { isValidUrl } from 'util/yup'

import { createProfile, updateProfile } from 'slices/profile'

import { CommonProps } from 'types/common'
import { ProfileType } from 'types/profile'

import NumPreviousClients from 'components/features/profile/NumPreviousClients'
import Step from 'components/features/util/Step'
import { profilesApi } from 'services/profiles'

type ProfileFormProps = CommonProps & {
  mode?: 'create' | 'edit'
  type?: 'coach' | 'client'
  onCancel?: () => void
  onSubmit?: (type: 'client' | 'coach') => void
}
const ProfileForm = ({
  id,
  className,
  mode = 'create',
  type = 'client',
  onCancel = () => undefined,
  onSubmit = () => undefined,
}: ProfileFormProps) => {
  const {
    user: { user },
    profile: { initiated, profile },
  } = useAppSelector((state) => state)
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [invalidateProfile] = profilesApi.useInvalidateProfileMutation()

  const [step, setStep] = useState<number>(0)

  const onNext = () => setStep(step + 1)
  const onPrev = () => setStep(Math.max(0, step - 1))

  return initiated ? (
    <Formik
      initialValues={{
        type,
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        dateOfBirth: profile?.dateOfBirth
          ? dayjs(profile.dateOfBirth).toDate()
          : dayjs().subtract(18, 'year').toDate(),
        city: profile?.city || '',
        timezone: profile?.timezone || dayjs.tz.guess(),
        profileImage: profile?.profileImage || null,
        clientDescription: profile?.client?.description || '',
        clientTags: profile?.client?.tags || [],
        businessName: profile?.coach?.businessName || '',
        coachDescription: profile?.coach?.description || '',
        links: profile?.coach?.links || [],
        coachTags: profile?.coach?.tags || [],
        numPreviousClients: profile?.coach?.numPreviousClients || 0,
        education: profile?.coach?.education || [],
        certifications: profile?.coach?.certifications || [],
        experience: profile?.coach?.experience || [],
      }}
      validationSchema={Yup.object({
        type: Yup.string().oneOf(['client', 'coach']),
        firstName: Yup.string().max(10000).required('this is a required field'),
        lastName: Yup.string().max(10000).required('this is a required field'),
        dateOfBirth: Yup.date()
          .max(
            dayjs().subtract(18, 'year').toDate(),
            'you must be at least 18 years old to sign up',
          )
          .required('this is a required field'),
        city: Yup.string().max(10000),
        profileImage: Yup.object().nullable(),
        businessName: Yup.string().max(10000),
        clientDescription: Yup.string().max(1000),
        links: Yup.array(
          Yup.string().test('is-url', 'this is not a valid url', (value) =>
            isValidUrl(value),
          ),
        ),
        timezone: Yup.string().max(10000).required(),
        clientTags: Yup.array(Yup.string()),
        coachDescription: Yup.string().max(1000),
        coachTags: Yup.array(Yup.string()),
        numPreviousClients: Yup.number().required(
          'you must state how many previous clients you have had',
        ),
        education: Yup.array(Yup.string()),
        certifications: Yup.array(Yup.string()),
        experience: Yup.array(Yup.string()),
      })}
      onSubmit={async (
        {
          type,
          firstName,
          lastName,
          dateOfBirth,
          city,
          profileImage,
          clientDescription,
          clientTags,
          businessName,
          coachDescription,
          links,
          timezone,
          coachTags,
          numPreviousClients,
          education,
          certifications,
          experience,
        },
        { setStatus },
      ) => {
        if (user) {
          const typeSpecific:
            | Pick<ProfileType, 'client'>
            | Pick<ProfileType, 'coach'> =
            type === 'client'
              ? {
                  client: {
                    createdTime: dayjs().valueOf(),
                    description: clientDescription,
                    tags: clientTags,
                    notifications: {},
                  },
                }
              : {
                  coach: {
                    createdTime: dayjs().valueOf(),
                    decisionTime: null,
                    decision: null,
                    searchIndex: getProfileIndex(
                      firstName,
                      lastName,
                      coachTags,
                      businessName,
                    ),
                    businessName,
                    description: coachDescription,
                    links,
                    tags: coachTags,
                    numPreviousClients,
                    education,
                    certifications,
                    experience,
                    availability: getDefaultAvailability(),
                    notifications: {},
                  },
                }
          const nextProfile: ProfileType = {
            id: user?.id,
            firstName,
            lastName,
            dateOfBirth:
              mode === 'edit' && profile
                ? profile.dateOfBirth
                : dayjs(dateOfBirth).valueOf(),
            city,
            timezone,
            profileImage,
            client: profile?.client || null,
            coach: profile?.coach || null,
            mode: type as 'client' | 'coach',
            lastUpdatedTime: dayjs().valueOf(),
            unavailableTimes: [],
            ...typeSpecific,
          }
          if (mode === 'edit') {
            const response = await dispatch(updateProfile(nextProfile))
            if (updateProfile.fulfilled.match(response)) {
              toast({
                title: 'Profile updated',
                description: 'Your changes were succesfully saved!',
                type: 'success',
              })
              onSubmit(type as 'client' | 'coach')
            } else {
              setStatus(true)
            }
          } else {
            const response = await dispatch(createProfile(nextProfile))
            if (createProfile.fulfilled.match(response)) {
              toast({
                title: 'Profile created',
                description:
                  type === 'client'
                    ? 'Welcome to the HatchPath family!'
                    : 'A member of our team will review your application',
                type: 'success',
              })
              onSubmit(type as 'client' | 'coach')
            } else {
              setStatus(true)
            }
          }
          invalidateProfile(nextProfile.id)
        } else {
          setStatus(true)
        }
      }}
    >
      {({
        touched,
        errors,
        isSubmitting,
        status,
        values,
        setStatus,
        submitForm,
      }) => (
        <Form
          id={id}
          className={cn('flex flex-col items-center', className)}
          onChange={() => setStatus()}
        >
          {step === 0 ? (
            <Step
              className="w-auto"
              step={step + 1}
              total={values.type === 'client' ? 4 : 6}
              title="Are you a client or coach?"
              onNext={onNext}
              onPrev={onCancel}
              isPrevHidden={mode === 'create'}
              prevText="Cancel update"
            >
              <Field name="type">
                {({ field }: FieldProps) => (
                  <SelectButton
                    className="my-10"
                    listClassName="gap-x-4"
                    itemClassName="py-5 px-3 flex flex-col items-start w-80"
                    items={[
                      {
                        id: 'client',
                        content: (
                          <>
                            <div className="flex flex-row justify-between items-center w-full">
                              <Icon
                                className="!w-10 !h-10"
                                icon="user-graduate"
                              />
                              {profile?.client && (
                                <Tooltip
                                  label="You already have a client account"
                                  wrapTrigger={true}
                                >
                                  <Icon
                                    className="!w-5 !h-5 text-green-600"
                                    icon="check-circle"
                                  />
                                </Tooltip>
                              )}
                            </div>
                            <h2 className="my-2">Client</h2>
                            <p className="text-left">
                              Find the right programs and the right coaches to
                              guide you to your unique health an3d wellness
                              goals
                            </p>
                          </>
                        ),
                      },
                      {
                        id: 'coach',
                        content: (
                          <>
                            <div className="flex flex-row justify-between items-center w-full">
                              <Icon
                                className="!w-10 !h-10"
                                icon="chalkboard-teacher"
                              />
                              {profile?.coach && (
                                <Tooltip
                                  label="You already have a coach account"
                                  wrapTrigger={true}
                                >
                                  <Icon
                                    className="!w-5 !h-5 text-green-600"
                                    icon="check-circle"
                                  />
                                </Tooltip>
                              )}
                            </div>
                            <h2 className="my-2">Coach</h2>
                            <p className="text-left">
                              Join a community of well-established coaches
                              providing their own specialized training and
                              teachings.
                            </p>
                          </>
                        ),
                      },
                    ]}
                    {...field}
                  />
                )}
              </Field>
            </Step>
          ) : step === 1 ? (
            <Step
              step={step + 1}
              total={values.type === 'client' ? 4 : 6}
              title="Some info about you"
              onNext={onNext}
              onPrev={onPrev}
              isNextDisabled={!!Object.keys(errors).length}
            >
              <Field name="firstName">
                {({ field }: FieldProps) => (
                  <InputText
                    label="First name"
                    error={touched.firstName ? errors.firstName : ''}
                    {...field}
                  />
                )}
              </Field>
              <Field name="lastName">
                {({ field }: FieldProps) => (
                  <InputText
                    label="Last name"
                    error={touched.lastName ? errors.lastName : ''}
                    {...field}
                  />
                )}
              </Field>
              <Field name="dateOfBirth">
                {({ field }: FieldProps) => (
                  <InputDate
                    label="Date of birth"
                    error={
                      touched.dateOfBirth &&
                      typeof errors.dateOfBirth === 'string'
                        ? errors.dateOfBirth
                        : ''
                    }
                    showShortcuts={false}
                    disabled={mode === 'edit'}
                    {...field}
                  />
                )}
              </Field>
              <Field name="city">
                {({ field }: FieldProps) => (
                  <InputAutoComplete
                    label="What city are you in?"
                    error={touched.city ? errors.city : ''}
                    options={CITIES}
                    {...field}
                  />
                )}
              </Field>
              <Field name="timezone">
                {({ field }: FieldProps) => (
                  <InputSelect
                    label="Your timezone"
                    error={touched.timezone ? errors.timezone : ''}
                    options={timezonesList}
                    {...field}
                  />
                )}
              </Field>
              <Field name="profileImage">
                {({ field }: FieldProps) => (
                  <InputImage
                    className="mt-4 text-center"
                    labelClassName="!text-center"
                    label="Upload your picture"
                    {...field}
                  />
                )}
              </Field>
            </Step>
          ) : step === 2 ? (
            <Step
              step={step + 1}
              total={values.type === 'client' ? 4 : 6}
              title="Tell us about yourself"
              onNext={onNext}
              onPrev={onPrev}
              isNextDisabled={!!Object.keys(errors).length}
            >
              {values.type === 'client' ? (
                <Field name="clientDescription">
                  {({ field }: FieldProps) => (
                    <InputArea
                      label="Describe yourself"
                      error={
                        touched.clientDescription
                          ? errors.clientDescription
                          : ''
                      }
                      rows={4}
                      characterLimit={1000}
                      {...field}
                    />
                  )}
                </Field>
              ) : (
                <>
                  <Field name="businessName">
                    {({ field }: FieldProps) => (
                      <InputText
                        label="Business name"
                        error={touched.businessName ? errors.businessName : ''}
                        {...field}
                      />
                    )}
                  </Field>
                  <Field name="coachDescription">
                    {({ field }: FieldProps) => (
                      <InputArea
                        label="Describe yourself"
                        error={
                          touched.coachDescription
                            ? errors.coachDescription
                            : ''
                        }
                        rows={4}
                        characterLimit={1000}
                        {...field}
                      />
                    )}
                  </Field>
                  <Field name="links">
                    {({ field }: FieldProps) => (
                      <InputMultiText
                        label="Your links"
                        error={
                          errors.links
                            ? 'all links must be valid urls starting with http:// or https://'
                            : ''
                        }
                        placeholder="https://"
                        {...field}
                      />
                    )}
                  </Field>
                </>
              )}
            </Step>
          ) : step === 3 ? (
            <Step
              step={step + 1}
              total={values.type === 'client' ? 4 : 6}
              title={
                values.type === 'client'
                  ? 'What are you interested in?'
                  : 'What do you have expertise in?'
              }
              onNext={() => {
                if (values.type === 'client') {
                  submitForm()
                } else {
                  onNext()
                }
              }}
              onPrev={onPrev}
              isNextDisabled={!!Object.keys(errors).length}
              nextText={
                values.type === 'client'
                  ? mode === 'edit' && !!profile?.client
                    ? 'Update profile'
                    : 'Create profile'
                  : 'Next'
              }
              loading={isSubmitting}
              error={!!status}
            >
              {values.type === 'client' ? (
                <Field name="clientTags">
                  {({ field }: FieldProps) => (
                    <InputTags
                      label="Tags"
                      error={
                        touched.clientTags &&
                        typeof errors.clientTags === 'string'
                          ? errors.clientTags
                          : ''
                      }
                      options={TAGS_LIST}
                      isUnique={true}
                      lowerCase={true}
                      {...field}
                    />
                  )}
                </Field>
              ) : (
                <Field name="coachTags">
                  {({ field }: FieldProps) => (
                    <InputTags
                      label="Tags"
                      error={
                        touched.coachTags &&
                        typeof errors.coachTags === 'string'
                          ? errors.coachTags
                          : ''
                      }
                      options={TAGS_LIST}
                      isUnique={true}
                      lowerCase={true}
                      {...field}
                    />
                  )}
                </Field>
              )}
            </Step>
          ) : step === 4 ? (
            <Step
              contentClassName="gap-y-10"
              step={step + 1}
              total={6}
              title="Your professional background"
              onPrev={onPrev}
              onNext={onNext}
            >
              <Field name="numPreviousClients">
                {({ field }: FieldProps) => (
                  <InputSelect
                    label="Number of previous clients"
                    error={
                      touched.numPreviousClients &&
                      typeof errors.numPreviousClients === 'string'
                        ? errors.numPreviousClients
                        : ''
                    }
                    options={[
                      {
                        label: '0 - 5',
                        value: 0,
                      },
                      {
                        label: '5 - 10',
                        value: 5,
                      },
                      {
                        label: 'More than 10',
                        value: 10,
                      },
                    ]}
                    {...field}
                  />
                )}
              </Field>
              <Field name="education">
                {({ field }: FieldProps) => (
                  <InputMultiText
                    label="Your education history"
                    error={
                      touched.education && typeof errors.education === 'string'
                        ? errors.education
                        : ''
                    }
                    placeholder="institution - year"
                    {...field}
                  />
                )}
              </Field>
              <Field name="certifications">
                {({ field }: FieldProps) => (
                  <InputMultiText
                    label="Your certifications"
                    error={
                      touched.certifications &&
                      typeof errors.certifications === 'string'
                        ? errors.certifications
                        : ''
                    }
                    placeholder="certification name - year"
                    {...field}
                  />
                )}
              </Field>
              <Field name="experience">
                {({ field }: FieldProps) => (
                  <InputMultiText
                    label="Your experience"
                    error={
                      touched.experience &&
                      typeof errors.experience === 'string'
                        ? errors.experience
                        : ''
                    }
                    placeholder="experience - year"
                    {...field}
                  />
                )}
              </Field>
            </Step>
          ) : (
            <Step
              step={step + 1}
              total={6}
              title="Review your submission"
              onPrev={onPrev}
              onNext={() => submitForm()}
              nextText={
                mode === 'edit' && profile?.coach?.decision === 'approved'
                  ? 'Update profile'
                  : 'Submit application'
              }
              error={!!status}
            >
              <p className="text-left">
                Make sure your information is correct before applying to be part
                of the HatchPath family. Our team will review your submission
                and get back to you as soon as possible
              </p>
              <dl className="flex flex-col gap-y-4">
                {[
                  {
                    label: 'Business name',
                    content: values.businessName ? values.businessName : 'N/A',
                  },
                  {
                    label: 'Links',
                    content: values.links.length ? (
                      <ul>
                        {values.links.map((link, idx) => (
                          <li key={idx}>{link}</li>
                        ))}
                      </ul>
                    ) : (
                      'No links'
                    ),
                  },
                  {
                    label: 'Timezone',
                    content: values.timezone,
                  },
                  {
                    label: 'Tags',
                    content: values.coachTags.length
                      ? values.coachTags.join(', ')
                      : 'No tags',
                  },
                  {
                    label: 'Number of previous clients',
                    content: (
                      <NumPreviousClients value={values.numPreviousClients} />
                    ),
                  },
                  {
                    label: 'Education',
                    content:
                      values.education.length > 0 ? (
                        <ul>
                          {values.education.map((education, idx) => (
                            <li key={idx}>{education}</li>
                          ))}
                        </ul>
                      ) : (
                        'No education history'
                      ),
                  },
                  {
                    label: 'Certifications',
                    content: values.certifications.length ? (
                      <ul>
                        {values.certifications.map((certification, idx) => (
                          <li key={idx}>{certification}</li>
                        ))}
                      </ul>
                    ) : (
                      'No certifications'
                    ),
                  },
                  {
                    label: 'Experience',
                    content: values.experience.length ? (
                      <ul>
                        {values.experience.map((experience, idx) => (
                          <li key={idx}>{experience}</li>
                        ))}
                      </ul>
                    ) : (
                      'No experience'
                    ),
                  },
                ].map(({ label, content }, idx) => (
                  <div key={idx}>
                    <dt className="font-semibold text-left">{label}</dt>
                    <dd className="text-left">{content}</dd>
                  </div>
                ))}
              </dl>
            </Step>
          )}
        </Form>
      )}
    </Formik>
  ) : (
    <Loader type="full" />
  )
}
export default ProfileForm
