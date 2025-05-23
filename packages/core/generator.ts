import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';

/**
 * Recursively parses a template and replaces any strings like `{{faker.method}}`
 */
function parseTemplate(template: any): any {
  if (Array.isArray(template)) {
    return template.map(parseTemplate);
  }

  if (typeof template === 'object' && template !== null) {
    const result: any = {};
    for (const key in template) {
      result[key] = parseTemplate(template[key]);
    }
    return result;
  }

  if (typeof template === 'string' && template.startsWith('{{') && template.endsWith('}}')) {
    const expression = template.slice(2, -2).trim();

    // Support format like: helpers.arrayElement:['A','B','C']
    const [rawMethod, rawArgs] = expression.split(':');
    const [category, method] = rawMethod.split('.');

    const fakerFunc = (faker as any)?.[category]?.[method];

    if (typeof fakerFunc === 'function') {
      if (rawArgs) {
        try {
          const parsedArgs = eval(rawArgs); // Safe in trusted template context
          return fakerFunc(...parsedArgs);
        } catch (err) {
          console.warn(`⚠️ Failed to parse arguments for: ${expression}`);
          return template;
        }
      } else {
        return fakerFunc();
      }
    } else {
      console.warn(`⚠️ Unknown faker method: ${expression}`);
      return template;
    }
  }

  return template;
}

export function generateData(templatePath: string): any {
  const raw = fs.readFileSync(path.resolve(templatePath), 'utf-8');
  const template = JSON.parse(raw);
  const parsed = parseTemplate(template);

  console.log("✅ Generated payload:", JSON.stringify(parsed, null, 2));

  // ✅ Ensure proper structure for GraphRunner ingestion
  return {
    vertices: parsed.vertices || [],
    edges: parsed.edges || []
  };
}

