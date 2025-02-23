// 🌐 HTML Template Engine - Making beautiful web pages with HATEOAS
// Built on top of HATEOAS for a full hypermedia experience

import { HateoasTemplate } from './hateoas.ts';
import { RenderOptions, TemplateContext } from './base.ts';
import { Link, Resource } from './hateoas.ts';
import { HttpOptions } from './http.ts';

// 🛡️ HTML escaping utilities - Because security is not optional!
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")   // & -> &amp;
    .replace(/</g, "&lt;")    // < -> &lt;
    .replace(/>/g, "&gt;")    // > -> &gt;
    .replace(/"/g, "&quot;")  // " -> &quot;
    .replace(/'/g, "&#039;"); // ' -> &#039;
}

// 📄 HTML Document options
export interface HtmlOptions extends HttpOptions {
  title?: string;     // 📝 Page title
  scripts?: string[]; // 📜 Script URLs to include
  styles?: string[];  // 🎨 Stylesheet URLs
  head?: string;      // 🧠 Additional head content
  noEscape?: boolean; // 🛡️ Disable HTML escaping (use with caution!)
}

export class HtmlTemplate extends HateoasTemplate {
  constructor(template: string) {
    super(template);
  }

  // 🎨 Convert HATEOAS links to HTML navigation
  private static renderLinks(links: Link[]): string {
    return links.map(link => `
      <a 
        href="${escapeHtml(link.href)}"
        rel="${escapeHtml(link.rel)}"
        ${link.method && link.method !== 'GET' ? `data-method="${escapeHtml(link.method)}"` : ''}
        ${link.title ? `title="${escapeHtml(link.title)}"` : ''}
      >${escapeHtml(link.title || link.rel)}</a>
    `).join('\n');
  }

  // 📄 Create a full HTML document
  static document(content: string, options: HtmlOptions = {}): HtmlTemplate {
    const {
      title = 'App',
      scripts = [],
      styles = [],
      head = ''
    } = options;

    const template = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${escapeHtml(title)}</title>
          ${styles.map(href => `<link rel="stylesheet" href="${escapeHtml(href)}">`).join('\n')}
          ${scripts.map(src => `<script src="${escapeHtml(src)}" defer></script>`).join('\n')}
          ${head}
        </head>
        <body>
          <nav class="hateoas-nav">{{_links}}</nav>
          ${content}
        </body>
      </html>
    `;

    return new HtmlTemplate(template);
  }

  // 📦 Create a full HTML response from a resource
  override resourceResponse<T>(
    resource: Resource<T>,
    context: TemplateContext = {},
    options: HtmlOptions = {}
  ): Response {
    // Convert links to HTML before rendering
    const fullContext = {
      ...context,
      data: resource.data,
      _links: HtmlTemplate.renderLinks(resource.links)
    };

    // Apply HTML escaping by default
    const renderOptions: RenderOptions = {
      transform: options.noEscape ? String : ((value: unknown) => escapeHtml(String(value)))
    };

    return super.toResponse(fullContext, {
      ...options,
      contentType: 'text/html; charset=utf-8'
    }, renderOptions);
  }

  // 🏭 Create a new HTML template
  static override  create(template: string): HtmlTemplate {
    return new HtmlTemplate(template);
  }
}
