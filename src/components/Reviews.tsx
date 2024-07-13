import Image from "next/image";

const Reviews = async ({ productId }: { productId: string }) => {
  try {
    const reviewRes = await fetch(
      `https://api.fera.ai/v3/public/reviews?product.id=${productId}&public_key=${process.env.NEXT_PUBLIC_FERA_ID}`
    );

    if (!reviewRes.ok) {
      // Handle non-2xx HTTP responses
      throw new Error(`Failed to fetch reviews: ${reviewRes.statusText}`);
    }

    const reviews = await reviewRes.json();

    if (!reviews.data) {
      // Handle case where data is not present in the response
      throw new Error("No reviews data found.");
    }

    return (
      <div>
        {reviews.data.map((review: any) => (
          <div className="flex flex-col gap-4" key={review.id}>
            {/* USER */}
            <div className="flex items-center gap-4 font-medium">
              <Image
                src={review.customer.avatar_url || "/default-avatar.png"}
                alt=""
                width={32}
                height={32}
                className="rounded-full"
              />
              <span>{review.customer.display_name || "Anonymous"}</span>
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
              {review.media && review.media.map((media: any) => (
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
        ))}
      </div>
    );
  } catch (error) {
    console.error(error);
    return <div>Error loading reviews. Please try again later.</div>;
  }
};

export default Reviews;
