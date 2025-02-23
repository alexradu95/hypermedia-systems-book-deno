// 🎯 Base Template Engine - The foundation of our templating system
// This is where the magic starts. Think of it as the V8 engine of our templates.

// 🎯 Types that make TypeScript happy
export type TemplateContext = Record<string, unknown>;

export interface RenderOptions {
  transform?: (value: unknown) => string;  // 🔄 Optional value transformer
}

// 🎨 Base Template - The canvas for all our templating masterpieces
export class Template {
  constructor(protected template: string) {}

  // 🎨 Render the template with data
  render(context: TemplateContext = {}, options: RenderOptions = {}): string {
    return this.template.replaceAll(
      /{{(\s*)([^{}]*?)(\s*)}}/g,
      (_match: string, _space1: string, expression: string, _space2: string) => {
        const value = this.evaluateExpression(expression.trim(), context);
        return options.transform?.(value) ?? String(value ?? '');
      }
    );
  }

  // 🔍 Evaluate expressions like 'user.name' in your templates
  protected evaluateExpression(expression: string, context: TemplateContext): unknown {
    // Split by dots and traverse the object (e.g., 'user.profile.name')
    return expression.split('.').reduce<unknown>((obj, key) => 
      obj && typeof obj === 'object' ? (obj as Record<string, unknown>)?.[key] : undefined
    , context);
  }

  // 🏭 Create a new template instance
  static create(template: string): Template {
    return new Template(template);
  }
}
