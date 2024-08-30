export default function page({ params }: { params: { slug: string } }) {
  return <div>{params.slug}</div>;
}
