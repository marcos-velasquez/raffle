import { html } from '../html/html';
import { $url } from '../url/url';

export class Multimedia {
  constructor(public readonly url: string) {}

  public isBase64() {
    return this.url.includes('base64');
  }

  public isTemporal() {
    return this.url.includes('dev-tempfiles');
  }

  public isEqual(type: string) {
    return this.getType().toLowerCase() === type.toLowerCase();
  }

  public async isDimension(width: number, height: number) {
    const element = await this.getElement();
    return element?.width === width && element?.height === height;
  }
  public isSVG() {
    return (
      this.isEqual('svg') ||
      this.isEqual('svg+xml') ||
      this.getUrl().includes('svg+xml') ||
      this.getUrl().includes('.svg')
    );
  }

  public isPNG() {
    return this.isEqual('png') || this.getUrl().includes('.png');
  }

  public isJPG() {
    return this.isEqual('jpg') || this.getUrl().includes('.jpg');
  }

  public isJPEG() {
    return this.isEqual('jpeg') || this.getUrl().includes('.jpeg');
  }

  public isWEBP() {
    return this.isEqual('webp') || this.getUrl().includes('.webp');
  }

  public isBase64Image() {
    return new RegExp(/data:image\/[^;]+;base64/i).test(this.url);
  }

  public isUnsplashImage() {
    return this.getUrl().includes('https://images.unsplash.com/');
  }

  public isLinkedinImage() {
    return this.getUrl().includes('https://media.licdn.com/dms/image/');
  }

  public isGoogleImage() {
    return this.getUrl().includes('https://lh3.googleusercontent.com/');
  }

  public isInstagramImage() {
    const isIGCdn =
      this.getUrl().includes('https://scontent-iad3-1.cdninstagram.com/') ||
      this.getUrl().includes('https://scontent-iad3-2.cdninstagram.com/');
    return isIGCdn && !this.isVideo();
  }

  public isImage() {
    return (
      this.isGIF() ||
      this.isPNG() ||
      this.isJPEG() ||
      this.isJPG() ||
      this.isWEBP() ||
      this.isBase64Image() ||
      this.isUnsplashImage() ||
      this.isSVG() ||
      this.isLinkedinImage() ||
      this.isGoogleImage() ||
      this.isInstagramImage()
    );
  }

  public isXLS() {
    return this.getType() === 'xls';
  }

  public isXLSX() {
    return this.getType() === 'xlsx';
  }

  public isPPT() {
    return this.getType() === 'ppt';
  }

  public isPPTX() {
    return this.getType() === 'pptx';
  }

  public isDOC() {
    return this.getType() === 'doc';
  }

  public isDOCX() {
    return this.getType() === 'docx';
  }

  public isLinkedinPDF() {
    return this.getUrl().includes('document-pdf-analyzed');
  }

  public isPDF() {
    return this.getType() === 'pdf' || this.isLinkedinPDF();
  }

  public isMov() {
    return this.getType() === 'mov';
  }

  public isLinkedinDocument() {
    return this.getUrl().includes('https://media.licdn.com/dms/document/media/');
  }

  public isDocument() {
    return (
      this.isXLS() ||
      this.isXLSX() ||
      this.isPPT() ||
      this.isPPTX() ||
      this.isDOC() ||
      this.isDOCX() ||
      this.isPDF() ||
      this.isLinkedinDocument()
    );
  }

  public isMP4() {
    return this.isEqual('mp4') || this.getUrl().includes('.mp4');
  }

  public isMOV() {
    return this.isEqual('mov') || this.getUrl().includes('.mov');
  }

  public isQuickTime() {
    return this.isEqual('quicktime') || this.getUrl().includes('.quicktime');
  }

  public isBase64Video() {
    return new RegExp(/data:video\/[^;]+;base64/i).test(this.url);
  }

  public isPexelsVideo() {
    return this.getUrl().includes('https://player.vimeo.com/');
  }

  public isLinkedinVideo() {
    return this.getUrl().includes('https://dms.licdn.com/playlist/vid/');
  }

  public isVideo() {
    return (
      this.isMP4() ||
      this.isMOV() ||
      this.isQuickTime() ||
      this.isBase64Video() ||
      this.isPexelsVideo() ||
      this.isLinkedinVideo()
    );
  }

  public isGiphyGif() {
    return this.getUrl().includes('giphy.com/media/');
  }

  public isGIF() {
    return this.isEqual('gif') || this.isGiphyGif();
  }

  public isMultimedia() {
    return this.isImage() || this.isVideo() || this.isDocument();
  }

  public includes(types: string[]) {
    return types.includes(this.getType());
  }

  public getUrl() {
    return this.url || '';
  }

  public getType(): string {
    return this.getUrl().split('.').pop()?.split(/\#|\?/)[0] ?? '';
  }

  public getFile() {
    return $url.to.file(this.getUrl());
  }

  public async getElement() {
    if (this.isImage()) {
      return html.create.imageElement.fromUrl(this.getUrl());
    }

    if (this.isVideo()) {
      return html.create.videoElement.fromUrl(this.getUrl());
    }

    return null;
  }
}
