import Image from "next/image";

const Reviews = async ({ productId }: { productId: string }) => {
  try {
    const reviewRes = await fetch(
      `https://api.fera.ai/v3/public/reviews?product.id=${productId}&public_key=${process.env.NEXT_PUBLIC_FERA_ID}`
    );

    if (!reviewRes.ok) {
      throw new Error("Failed to fetch reviews");
    }

    const reviews = await reviewRes.json();

    if (!reviews.data || !Array.isArray(reviews.data)) {
      throw new Error("Reviews data is not valid");
    }

    return reviews.data.map((review: any) => (
      <div className="flex flex-col gap-4" key={review.id}>
        {/* USER */}
        <div className="flex items-center gap-4 font-medium">
          <Image
            src={review.customer.avatar_url}
            alt=""
            width={32}
            height={32}
            className="rounded-full"
          />
          <span>{review.customer.display_name}</span>
        </div>
        {/* STARS */}
        <div className="flex gap-2">
          {Array.from({ length: review.rating }).map((_, index) => (
            <Image src="/star.png" alt="" key={index} width={16} height={16} />
          ))}
        </div>
        {/* DESC */}
        {review.heading && <p>{review.heading}</p>}
        {review.body && <p>{review.body}</p>}
        <div className="">
          {review.media.map((media: any) => (
            <Image
              src={media.url}
              key={media.id}
              alt=""
              width={100}
              height={50}
              className="object-cover"
            />
          ))}
        </div>
      </div>
    ));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return null; // or display an error message component
  }
};

export default Reviews;
