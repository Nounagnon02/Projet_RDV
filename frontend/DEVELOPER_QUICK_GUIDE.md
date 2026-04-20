# 🎯 Developer Quick Reference: Translation-Safe Components

## Rule #1: Icons Are NEVER Translatable

### ✅ DO: Use ProtectedIcon Wrapper

```jsx
import { ProtectedIcon } from './ui';
import { ShoppingBag, Menu, X } from 'lucide-react';

// Lucide icons
<ProtectedIcon>
  <ShoppingBag size={20} />
</ProtectedIcon>

// Material Symbols
<ProtectedIcon>
  <span className="material-symbols-outlined">flare</span>
</ProtectedIcon>
```

### ❌ DON'T: Leave Icons Unprotected

```jsx
// ❌ WRONG - This will be translated!
<ShoppingBag size={20} />

// ❌ WRONG - Material icon exposed
<span className="material-symbols-outlined">flare</span>

// ❌ WRONG - Logo not protected
<h2>{siteName}</h2>
```

---

## Rule #2: Logos & Brand Names Are NEVER Translatable

### ✅ DO: Use ProtectedLogo Wrapper

```jsx
import { ProtectedLogo } from './ui';

<ProtectedLogo>
  <h2>{siteName}</h2>
</ProtectedLogo>

<ProtectedLogo as="span">Elsa Coiffure</ProtectedLogo>
```

### ❌ DON'T: Expose Logos to Translation

```jsx
// ❌ WRONG
<h2 className="logo">{siteName}</h2>

// ✅ CORRECT
<ProtectedLogo>
  <h2>{siteName}</h2>
</ProtectedLogo>
```

---

## Rule #3: HTML Content Without Components

If you can't use components, add attributes directly:

```jsx
<span 
  translate="no" 
  data-i18n="false"
  className="material-symbols-outlined"
>
  mail
</span>
```

---

## Checklist for New Components

When building new components with icons or logos:

- [ ] All icons wrapped in `<ProtectedIcon>`?
- [ ] All logos wrapped in `<ProtectedLogo>`?
- [ ] Using Material Symbols? Has `material-symbols-outlined` class?
- [ ] Using Lucide icons? Wrapped in ProtectedIcon?
- [ ] Text content translatable only via `t()`?
- [ ] No hardcoded text without translation key?

---

## Common Patterns

### Navigation Item with Icon
```jsx
<Link to={path}>
  <ProtectedIcon>
    <span className="material-symbols-outlined">menu</span>
  </ProtectedIcon>
  <span>{t('navbar.menu')}</span>
</Link>
```

### Button with Icon
```jsx
<Button>
  <ProtectedIcon>
    <ShoppingBag size={20} />
  </ProtectedIcon>
  {t('common.shop')}
</Button>
```

### Logo + Brand Name
```jsx
<Link to="/">
  <ProtectedIcon>
    <span className="material-symbols-outlined">flare</span>
  </ProtectedIcon>
  <ProtectedLogo>
    <h2>{settings.site_name}</h2>
  </ProtectedLogo>
</Link>
```

### Contact Icon + Text
```jsx
<li>
  <ProtectedIcon>
    <span className="material-symbols-outlined">mail</span>
  </ProtectedIcon>
  <span>{contactEmail}</span>
</li>
```

---

## Testing Your Changes

1. **Change language** via language switcher
2. **Verify icons stay identical**
3. **Verify text translates**
4. **Check console** for validation warnings

---

## Import Statements

```jsx
// Icons
import { ProtectedIcon } from './ui';

// Logos
import { ProtectedLogo } from './ui';

// Validator (dev only)
import TranslationProtectionValidator from './components/TranslationProtectionValidator';

// For translation testing
import { useTranslation } from 'react-i18next';
```

---

## CSS Classes Available

For emergency fallback (if components not available):

```css
.icon-protected { /* Protects icons */ }
.logo-protected { /* Protects logos */ }
.emoji-protected { /* Protects emojis */ }
```

Usage:
```jsx
<span className="material-symbols-outlined icon-protected">mail</span>
```

---

## Validation in Development

The automatic validator will warn if icons are unprotected:

```
⚠️ Icon #0 "flare" is NOT protected from translation
⚠️ Logo element "brand-logo" is NOT protected from translation
```

Fix these warnings by using the protection components!

---

## Performance Tips

✅ No performance impact from protection
✅ All methods are CSS or attribute-based
✅ No hidden JavaScript wrapping
✅ Zero runtime overhead

---

## Questions?

See `TRANSLATION_PROTECTION_GUIDE.md` for full documentation.

