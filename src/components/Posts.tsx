import PostCard from "./PostCard";

export default function Posts({ data }: { data: any }) {
  return (
    <div className="flex justify-center flex-wrap">
      {data.map((item: any) => (
        <PostCard key={item.postId} postId={item.postId} userId={item.userId} title={item.title} description={item.description} time={item.time} />
      ))}
    </div>
  );
}