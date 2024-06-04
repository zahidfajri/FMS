export default function cleanImgbbUrl(url: string){
  if (url.startsWith("https://i.ibb.co/") && url.split("/")[4]) return url.split("/")[4];
  return url;
}