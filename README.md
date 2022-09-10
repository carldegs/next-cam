# nextjs-typescript-boilerplate

A custom template based on NextJS in Typescript.

It includes the following libraries/frameworks:

- [Chakra UI](https://chakra-ui.com/) (UI Framework)
- [React Hook Form](https://react-hook-form.com/) (Form Validation)
- [Joi](https://joi.dev/api/) (Validation Schema)
- [React Query](https://react-query.tanstack.com/) (Data Handling)

The following are also setup:

- Added `useJoiForm` that assists in using `useForm` with a `joiResolver`. This uses a custom class `FormObject` that would also assist you in creating the default values and schemas of your form.
- Addded `<QFormControl />` which can help create `FormControl`s already integrated with `react-hook-form`. To use this:
  - you must wrap them in a `<FormProvider />`. More info [here](https://react-hook-form.com/api/useformcontext).
  - For nested or complex inputs (e.g, using `<InputGroup />`), use the control prop to set what component should be registered.
- Custom Layout component with Sidebar
- ESLint setup using recommended rules
- Custom prettier rules that includes automatic sorting of imports
- Pre-commit check that validates if there are no prettier, ESLint and Typescript errors
- Added a post-install script that generates Chakra UI theme typings that takes into account the extended theme set on `/theme.ts`

## Sample Form Handler

### Creating the Form Handler

```typescript
interface UserProfile {
  firstName: string;
  lastName: string;
  age: number;
  gender: GenderDemographicsEnum;
  yearsInCurrRole: number;
}

export default new FormObject<UserProfile>(
  {
    firstName: '',
    lastName: '',
    age: null,
    gender: null,
    yearsInCurrRole: null,
  },
  {
    firstName: Joi.string()
      .required()
      .messages(createErrorMessages('First Name', ['emptyString'])),
    lastName: Joi.string()
      .required()
      .messages(createErrorMessages('Last Name', ['emptyString'])),
    age: Joi.number()
      .min(MIN_AGE)
      .required()
      .messages(
        createErrorMessages('Age', [
          'notNumber',
          { type: 'lessThanMin', min: MIN_AGE },
        ])
      ),
    gender: Joi.string()
      .valid(...Object.values(GenderDemographicsEnum))
      .messages(createErrorMessages('Gender', ['emptyString', 'notOption'])),
    yearsInCurrRole: Joi.number()
      .min(MIN_YEARS_IN_CURR_ROLE)
      .required()
      .messages(
        createErrorMessages('Field', [
          'notNumber',
          { type: 'lessThanMin', min: MIN_YEARS_IN_CURR_ROLE },
        ])
      ),
  }
);
```

### Using the Form Handler

- The form must be surrounded by `<FormProvider />`.
- A `<FormControl />` wrapper named `<QFormControl />` was created to do the following:
  
  1. Handle passing the `register(name)` props to the child input component. This means that you would only need to pass the `name` prop to link the input component to a field in `react-hook-form`.
  2. Handles showing the `react-hook-form` error messages. This can be disabled by passing the `hideErrorMessage` prop to `<QFormControl />`.

```typescript
const EditProfile: React.FC = () => {    
  const methods = useJoiForm(profileFormObject);
  
  return (
    <FormProvider {...methods}>
      <QFormControl
        name="firstName"
        label="First Name"
        isRequired
      >
        <Input variant="flushed" />
      </QFormControl>

      <QFormControl
        name="lastName"
        label="Last Name"
        isRequired
      >
        <Input variant="flushed" />
      </QFormControl>

      /* ... */
    </FormProvider>
  )
}
```

This should also work for other Chakra UI input components like`<Select />`, `<Textarea />`, and `<Checkbox />`.

```typescript
<QFormControl name="confirmed" isRequired mt={8} hideErrorMessage>
  <Checkbox>
    I agree to be contacted when new organisations are added.
  </Checkbox>
</QFormControl>
```

```typescript
<QFormControl name="country" label="Country" isRequired flex={1}>
  <Select variant="flushed">
    {Object.values(countries).map((country) => (
      <option value={country.code} key={country.code}>
        {country.name}
      </option>
    ))}
  </Select>
</QFormControl>
```

If you need to use nested (e.g, using `<InputGroup />`) or complex (e.g, handling array of inputs)input components , using `react-hook-form`'s `<Controller />` is the way to go.

```typescript
const EditProfile: React.FC = () => {    
  const methods = useJoiForm(profileFormObject);
  const surveyFormData = [
    {
      name: 'serviceQuality',
      label: 'Quality of Service',
      img: PaternityImage,
    },
    // ...
  ]
  
  return (
    <Layout>
      {surveyPageData.map((pdata) => (
        <Box
          key={`slider-${pdata.name}`}
          display={pdata.name === pageData.name ? 'inherit' : 'none'}
        >
          <Controller
            control={methods.control}
            name={pdata.name}
            render={({ field: { onChange, value, name } }) => (
              <AnimatedSlider
                onChange={onChange}
                value={value}
                name={name}
              />
            )}
          />
        </Box>
      ))}
    </Layout>
  )
}
```

## API Handlers

Use the `createApiHandler` to easily create your api routes.

```typescript
// /pages/api/users/[id].ts

const UserHandler = createApiHandler().get(async (req, res) => {
  const { id } = req.query;

  if (isInvalid(id)) {
    throw new Error('ID invalid');
  }

  const userData = getData(id);

  return res.json(userData);
}).post(async (req, res) => {
  // ...
}).put(async (req, res) => {
  // ...
})
//...
```

## API Errors

Extend the `APIError` class at `/src/lib/errors/APIError` when creating custom errors.

```typescript
export class ListingNotFoundError extends ApiError {
  constructor(id: string) {
    super(404, `Listing of ${id} was not found.`);
  }
}
```
