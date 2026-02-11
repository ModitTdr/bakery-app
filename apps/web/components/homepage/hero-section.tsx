import Image from "next/image"
import { Button } from "../ui/button"

const HeroSection = () => {
  return (
    <section className="w-full min-h-screen flex items-center justify-center px-4 md:px-10">
      <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-8 max-w-7xl w-full">

        {/* Text */}
        <div className="text-center md:text-left space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-playfair">
            Indulge in every{" "}
            <span className="text-orange-500">bite</span>
          </h1>

          <p className="mt-4 text-gray-600 max-w-lg mx-auto md:mx-0">
            From flaky pastries to sweet treats, everything we bake is made fresh, full of flavor, and meant to be enjoyed slowly.
          </p>

          <div>
            <Button>Cta Button</Button>
          </div>
        </div>

        {/* Image */}
        <Image
          src="/images/muffins.png"
          alt="hero"
          width={600}
          height={600}
          priority
          className="w-80 md:w-[40vw] max-w-xl h-auto"
        />

      </div>
    </section>
  )
}

export default HeroSection
