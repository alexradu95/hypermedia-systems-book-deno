// 🌐 HTTP Template Engine - Making web responses beautiful!
// Extends base template with HTTP-specific capabilities

import { Template, TemplateContext, RenderOptions } from './base.ts';

// 🌐 HTTP specific options
export interface HttpOptions {
  status?: number;           // 📊 HTTP status code
  contentType?: string;      // 📝 Content-Type header
  headers?: HeadersInit;     // 📨 Additional headers
}

export class HttpTemplate extends Template {
  constructor(template: string) {
    super(template);
  }

  // 📬 Turn your template into an HTTP response
  toResponse(
    context: TemplateContext = {}, 
    options: HttpOptions = {},
    renderOptions: RenderOptions = {}
  ): Response {
    const {
      status = 200,
      contentType = 'text/html; charset=utf-8',
      headers = {}
    } = options;

    return new Response(this.render(context, renderOptions), {
      status,
      headers: {
        'Content-Type': contentType,
        ...headers
      }
    });
  }

  // 🏭 Create a new HTTP template
  static override create(template: string): HttpTemplate {
    return new HttpTemplate(template);
  }
}
