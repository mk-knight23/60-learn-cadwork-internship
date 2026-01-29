# ADR 001: Use Angular Material Over Custom Components

## Status
Accepted

## Context
We needed to choose a UI component library for the Cadwork Internship Learning Portal. The project started with custom Tailwind CSS components but needed to scale into a professional enterprise learning system.

## Decision
We will use Angular Material as our primary component library, supplemented with custom SCSS for project-specific styling.

## Consequences

### Positive
- **Accessibility**: Angular Material components are WCAG 2.1 AA compliant out of the box
- **Consistency**: Follows Material Design guidelines that users recognize
- **Maintenance**: Google's team maintains the library; we focus on our content
- **Enterprise Ready**: Used by major corporations; meets enterprise standards
- **Time Savings**: Pre-built components for tables, dialogs, forms, navigation

### Negative
- **Visual Identity**: Looks like "another Material Design app"
- **Customization Limits**: Some components resist heavy customization
- **Bundle Size**: Adds ~100KB to the initial bundle
- **Learning Curve**: Team needs to learn Material APIs and theming system

## Alternatives Considered

### 1. Continue with Custom Tailwind Components
**Rejected because**: 
- Would need to build and maintain our own accessible component library
- Internship timeline doesn't allow for this level of infrastructure
- Testing burden for accessibility compliance

### 2. Use PrimeNG
**Rejected because**:
- While feature-rich, the API surface is larger and more complex
- Less consistent with enterprise design standards
- Smaller community than Angular Material

### 3. Use NG-ZORRO (Ant Design)
**Rejected because**:
- Excellent design system but less familiar to Western enterprise users
- Documentation quality varies
- Additional mental overhead for the team

## Implementation Notes

We use Angular Material's theming system to customize:
- Primary color: Our brand blue (#2563EB)
- Typography: Inter font family
- Density: "Comfortable" for learning content
- Border radius: Reduced for professional appearance

## Related Decisions
- ADR 002: Theming Strategy
- ADR 003: Component Architecture

## References
- [Angular Material Documentation](https://material.angular.io/)
- [Material Design Guidelines](https://m3.material.io/)
