import Image from "next/image"
import Link from "next/link"
import React from "react"

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Image
        width={300}
        height={300}
        alt="not found illustration"
        src="/notfound.png"
      />
      <div className="flex flex-col items-center gap-2">
        <h1 className="font-bold text-2xl">PAGE NOT FOUND</h1>
        <Link href="/" className="text-[#08a88a] text-xl mt-7">
          Go back
        </Link>
      </div>
    </div>
  )
}

export default NotFound
