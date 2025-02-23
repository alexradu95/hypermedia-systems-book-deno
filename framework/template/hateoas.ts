// 🔗 HATEOAS Template Engine - Making your API navigate itself!
// Because APIs should be self-documenting and easy to explore

import { HttpTemplate } from './http.ts';
import { TemplateContext, RenderOptions } from './base.ts';
import { HttpOptions } from './http.ts';

// 🔗 Link Definition - The GPS coordinates for your API
export interface Link {
  href: string;    // 🌍 Where this link takes you
  rel: string;     // 👥 The relationship to the current resource
  method?: string; // 🎯 What HTTP method to use
  title?: string;  // 📝 Human-readable description
}

// 📦 Resource Definition - Your data + its navigation manual
export interface Resource<T> {
  data: T;         // 📄 The actual content
  links: Link[];   // 🧭 Navigation links - where can I go from here?
}

// 🚀 HATEOAS Template - Making your API explorable
export class HateoasTemplate extends HttpTemplate {
  constructor(template: string) {
    super(template);
  }

  // 🎁 Create a response with HATEOAS superpowers
  override toResponse(
    context: TemplateContext = {},
    options: HttpOptions = {},
    renderOptions: RenderOptions = {}
  ): Response {
    const fullContext = {
      ...context,
      _links: context._links // Links should be pre-rendered by specific implementations
    };

    return super.toResponse(fullContext, options, renderOptions);
  }

  // 📦 Create a full HATEOAS response from a resource
  resourceResponse<T>(
    resource: Resource<T>,
    context: TemplateContext = {},
    options: HttpOptions = {},
    renderOptions: RenderOptions = {}
  ): Response {
    const fullContext = { ...context, data: resource.data };
    return this.toResponse(fullContext, options, renderOptions);
  }

  // 🏭 Create a new HATEOAS template
  static override create(template: string): HateoasTemplate {
    return new HateoasTemplate(template);
  }

  // 🔨 Helper to create a link object
  static createLink(href: string, rel: string, method = "GET", title?: string): Link {
    return { href, rel, method, title };
  }
}
