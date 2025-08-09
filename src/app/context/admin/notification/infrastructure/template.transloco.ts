import { TranslocoService } from '@jsverse/transloco';
import { Template } from '../domain';

export abstract class TemplateTransloco extends Template {
  protected translocoService: TranslocoService;

  public with(translocoService: TranslocoService): TemplateTransloco {
    this.translocoService = translocoService;
    return this;
  }
}

export const translate = (translocoService: TranslocoService) => {
  return (template: TemplateTransloco) => template.with(translocoService);
};
