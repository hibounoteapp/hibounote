export interface Post {
  imageURL?:string,
  id: number,
  title: string,
  shortDesc: string,
  desc: string,
  date: Date,
  tag: 'Release Notes' | "FAQ" | "User Guide" | "Community"
}
