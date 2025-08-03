import { Multimedia } from '../../multimedia/multimedia';

describe('Multimedia', () => {
  test('should detect image types', () => {
    const png = new Multimedia('test.png');
    const jpg = new Multimedia('test.jpg');
    const jpeg = new Multimedia('test.jpeg');
    const webp = new Multimedia('test.webp');
    const svg = new Multimedia('test.svg');
    const base64Img = new Multimedia('data:image/png;base64,abc123');

    expect(png.isPNG()).toBe(true);
    expect(jpg.isJPG()).toBe(true);
    expect(jpeg.isJPEG()).toBe(true);
    expect(webp.isWEBP()).toBe(true);
    expect(svg.isSVG()).toBe(true);
    expect(base64Img.isBase64Image()).toBe(true);

    [png, jpg, jpeg, webp, svg, base64Img].forEach((media) => {
      expect(media.isImage()).toBe(true);
    });
  });

  test('should detect document types', () => {
    const pdf = new Multimedia('test.pdf');
    const doc = new Multimedia('test.doc');
    const docx = new Multimedia('test.docx');
    const xls = new Multimedia('test.xls');
    const xlsx = new Multimedia('test.xlsx');
    const ppt = new Multimedia('test.ppt');
    const pptx = new Multimedia('test.pptx');

    expect(pdf.isPDF()).toBe(true);
    expect(doc.isDOC()).toBe(true);
    expect(docx.isDOCX()).toBe(true);
    expect(xls.isXLS()).toBe(true);
    expect(xlsx.isXLSX()).toBe(true);
    expect(ppt.isPPT()).toBe(true);
    expect(pptx.isPPTX()).toBe(true);

    [pdf, doc, docx, xls, xlsx, ppt, pptx].forEach((media) => {
      expect(media.isDocument()).toBe(true);
    });
  });

  // Test video detection
  test('should detect video types', () => {
    const mp4 = new Multimedia('test.mp4');
    const mov = new Multimedia('test.mov');
    const quicktime = new Multimedia('test.quicktime');
    const base64Vid = new Multimedia('data:video/mp4;base64,abc123');

    expect(mp4.isMP4()).toBe(true);
    expect(mov.isMOV()).toBe(true);
    expect(quicktime.isQuickTime()).toBe(true);
    expect(base64Vid.isBase64Video()).toBe(true);

    [mp4, mov, quicktime, base64Vid].forEach((media) => {
      expect(media.isVideo()).toBe(true);
    });
  });

  test('should handle utility methods', () => {
    const media = new Multimedia('test.png?param=1#hash');
    expect(media.getType()).toBe('png');
    expect(media.getUrl()).toBe('test.png?param=1#hash');
    expect(media.includes(['png', 'jpg'])).toBe(true);
    expect(media.isEqual('PNG')).toBe(true);
  });
});
