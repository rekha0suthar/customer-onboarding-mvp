# Validation Rules

This directory contains all validation rules for the application, organized by domain.

## Structure

```
validators/
├── auth.validators.js       # Authentication validations (login, register)
├── customer.validators.js   # Customer profile validations
├── document.validators.js   # Document upload validations
├── admin.validators.js      # Admin operations validations
└── README.md               # This file
```

## Benefits of This Structure

✅ **Reusability** - Validation rules can be imported and reused across routes
✅ **Maintainability** - All validations in one place, easy to find and update
✅ **Testability** - Each validation can be tested independently
✅ **Readability** - Route files are cleaner and focused on routing logic
✅ **Consistency** - Standardized validation messages and rules

## Usage Example

### In Route Files

```javascript
// auth.routes.js
import { registerValidation, loginValidation } from '../validators/auth.validators.js';

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
```

### Creating New Validators

```javascript
// example.validators.js
import { body } from 'express-validator';

export const exampleValidation = body('field')
  .notEmpty()
  .withMessage('Field is required');

export const exampleRuleSet = [
  exampleValidation,
  // ... more rules
];
```

## Validation Rule Components

### Individual Validators
Small, reusable validation rules for single fields:
```javascript
export const emailValidation = body('email')
  .isEmail()
  .normalizeEmail();
```

### Rule Sets
Arrays combining multiple validators for specific endpoints:
```javascript
export const registerValidation = [
  emailValidation,
  passwordValidation,
  firstNameValidation,
];
```

## Common Patterns

### Required Fields
```javascript
body('field').notEmpty().withMessage('Field is required')
```

### Optional Fields
```javascript
body('field').optional().trim().isLength({ max: 100 })
```

### Custom Validation
```javascript
body('field').custom((value, { req }) => {
  if (value !== req.body.otherField) {
    throw new Error('Fields must match');
  }
  return true;
})
```

### Async Validation (Database Check)
```javascript
body('email').custom(async (value) => {
  const user = await User.findByEmail(value);
  if (user) {
    throw new Error('Email already exists');
  }
  return true;
})
```

## Testing

To test validators independently:

```javascript
import { registerValidation } from '../validators/auth.validators.js';
import { validationResult } from 'express-validator';

// Mock request object
const req = {
  body: {
    email: 'test@example.com',
    password: 'Pass123'
  }
};

// Run validations
await Promise.all(registerValidation.map(validation => validation.run(req)));

// Check results
const errors = validationResult(req);
console.log(errors.isEmpty()); // true if valid
```

## Maintenance

When updating validation rules:

1. Update the validator file (e.g., `auth.validators.js`)
2. Changes automatically apply to all routes using that validator
3. Test the validation separately before deploying
4. Document any breaking changes

## Best Practices

✅ **DO:**
- Use descriptive error messages
- Sanitize input (trim, normalize)
- Keep validators small and focused
- Reuse common validators
- Document complex validation logic

❌ **DON'T:**
- Duplicate validation logic
- Mix business logic with validation
- Make error messages too technical
- Skip validation on "trusted" inputs
- Forget to handle optional fields properly

