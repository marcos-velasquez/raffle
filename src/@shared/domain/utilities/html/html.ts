export const html = {
  create: {
    videoElement: {
      fromUrl: (url: string): Promise<HTMLVideoElement> => {
        return new Promise((resolve) => {
          const videoElement = document.createElement('video');
          videoElement.crossOrigin = 'anonymous';
          const source = document.createElement('source');
          source.src = url;
          source.type = 'video/mp4';
          videoElement.appendChild(source);
          videoElement.addEventListener('loadedmetadata', () => {
            videoElement.width = videoElement.videoWidth;
            videoElement.height = videoElement.videoHeight;
            resolve(videoElement);
          });
        });
      },
    },

    imageElement: {
      fromUrl: (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve) => {
          const image = new Image();
          image.crossOrigin = 'anonymous';
          image.onload = () => resolve(image);
          image.src = url;
        });
      },

      fromFile: (file: File) => {
        return html.create.imageElement.fromUrl(URL.createObjectURL(file));
      },
    },
  },
};
