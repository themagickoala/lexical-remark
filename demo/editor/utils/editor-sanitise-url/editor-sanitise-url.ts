export const editorSanitiseUrl = (url: string): string => {
  /** A pattern that matches safe  URLs. */
  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi;

  /** A pattern that matches safe data URLs. */
  const DATA_URL_PATTERN =
    /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

  const trimmedUrl = String(url).trim();

  if (trimmedUrl.match(SAFE_URL_PATTERN) || trimmedUrl.match(DATA_URL_PATTERN)) {
    return trimmedUrl;
  }

  return 'https://';
};
