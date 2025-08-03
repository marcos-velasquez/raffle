import { html } from '../../html/html';

describe('html', () => {
  const mockCreateObjectURL = jest.fn();
  global.URL.createObjectURL = mockCreateObjectURL;
  global.URL.revokeObjectURL = jest.fn();

  beforeEach(() => {
    mockCreateObjectURL.mockClear();
    jest.clearAllMocks();
  });

  describe('createVideoElement', () => {
    it('should create a video element with the correct properties', async () => {
      const mockVideo = document.createElement('video');
      const mockSource = document.createElement('source');

      const createElementSpy = jest.spyOn(document, 'createElement');
      createElementSpy.mockImplementation((tagName) => {
        return tagName === 'video' ? mockVideo : mockSource;
      });

      Object.defineProperty(mockVideo, 'videoWidth', { value: 640 });
      Object.defineProperty(mockVideo, 'videoHeight', { value: 480 });

      const testUrl = 'https://example.com/video.mp4';
      const videoPromise = html.create.videoElement.fromUrl(testUrl);

      mockVideo.dispatchEvent(new Event('loadedmetadata'));

      const videoElement = await videoPromise;

      expect(videoElement).toBe(mockVideo);
      expect(videoElement.crossOrigin).toBe('anonymous');
      expect(videoElement.width).toBe(640);
      expect(videoElement.height).toBe(480);
      expect(videoElement.firstChild).toBe(mockSource);
      expect(mockSource.src).toBe(testUrl);
      expect(mockSource.type).toBe('video/mp4');

      createElementSpy.mockRestore();
    });
  });

  describe('createImageElement', () => {
    it('should create an image element with the correct properties', async () => {
      const testUrl = 'https://example.com/image.jpg';
      const mockImage = new Image();

      const originalImage = global.Image;
      (global as any).Image = jest.fn().mockImplementation(() => mockImage);

      const imagePromise = html.create.imageElement.fromUrl(testUrl);

      mockImage.onload?.({} as Event);

      const imageElement = await imagePromise;

      expect(imageElement).toBe(mockImage);
      expect(imageElement.crossOrigin).toBe('anonymous');
      expect(imageElement.src).toBe(testUrl);

      // Restore original Image
      global.Image = originalImage;
    });
  });

  describe('createImageFromFile', () => {
    it('should create an image from a file', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockObjectUrl = 'blob:test-url';
      const mockImage = new Image();

      mockCreateObjectURL.mockReturnValue(mockObjectUrl);

      const originalImage = global.Image;
      (global as any).Image = jest.fn().mockImplementation(() => mockImage);

      const imagePromise = html.create.imageElement.fromFile(mockFile);

      mockImage.onload?.({} as Event);

      const imageElement = await imagePromise;

      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockFile);
      expect(imageElement.src).toBe(mockObjectUrl);

      global.Image = originalImage;
    });
  });
});
