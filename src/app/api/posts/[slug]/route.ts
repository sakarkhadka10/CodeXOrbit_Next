import { NextResponse } from "next/server";
import { posts } from "../route";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = posts.find((post) => post.slug === params.slug);

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 