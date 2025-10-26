import Image from "next/image";
import Link from "next/link";


const Insta = () => {
    return (
        <div className="mx-auto max-w-2xl  pb-16 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className=" mt-24 grid grid-cols-1 gap-y-10 gap-x-16 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">

                <div className="mx-auto imageContainer">
                    <Image src="/images/insta/insta01.png" width={306} height={306} alt="instaOne" />
                    <Link href={"https://www.instagram.com/p/DQNdxYqiEx1/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="} target="_blank">
                        <button
                            className="hidden text-white font-semibold absolute z-10"
                            style={{
                                top: "45%",
                                right: "45%",
                            }}
                        >
                            <Image src="/images/insta/instagram.svg" alt="instagram" width={36} height={36} />
                        </button>
                    </Link>
                </div>

                <div className="mx-auto imageContainer">
                    <Image src="/images/insta/insta02.png" width={306} height={306} alt="instaTwo" />
                    <Link href={"https://www.instagram.com/p/DQKt5RoCCo_/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="} target="_blank">
                        <button
                            className="hidden text-white font-semibold absolute z-10"
                            style={{
                                top: "45%",
                                right: "45%",
                            }}
                        >
                            <Image src="/images/insta/instagram.svg" alt="instagram" width={36} height={36} />
                        </button>
                    </Link>
                </div>

                <div className="mx-auto imageContainer">
                    <Image src="/images/insta/insta03.png" width={306} height={306} alt="instaThree" />
                    <Link href={"https://www.instagram.com/p/DQIPenBEnrR/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="} target="_blank">
                        <button
                            className="hidden text-white font-semibold absolute z-10"
                            style={{
                                top: "45%",
                                right: "45%",
                            }}
                        >
                            <Image src="/images/insta/instagram.svg" alt="instagram" width={36} height={36} />
                        </button>
                    </Link>
                </div>

                <div className="mx-auto imageContainer">
                    <Image src="/images/insta/insta04.png" width={306} height={306} alt="instaFour" />
                    <Link href={"https://www.instagram.com/p/DQFeYp8k4f3/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="} target="_blank">
                        <button
                            className="hidden text-white font-semibold absolute z-10"
                            style={{
                                top: "45%",
                                right: "45%",
                            }}
                        >
                            <Image src="/images/insta/instagram.svg" alt="instagram" width={36} height={36} />
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default Insta
