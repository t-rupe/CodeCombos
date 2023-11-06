import {
  CodeBracketIcon,
  ComputerDesktopIcon,
  LightBulbIcon,
} from "@heroicons/react/20/solid";

const features = [
    {
        name: 'Customized Curations',
        description:
          "Create a tech stack that's as unique as your project with Code Combos. Our platform offers advanced filtering options to help you curate a selection of technologies tailored to your specific needs. Whether you're starting out or scaling up, you'll find the right tools to bring your vision to life with precision and personalization.",
        href: '#',
        icon: CodeBracketIcon,
      }
      ,

  {
    name: "Innovative Tech Stack",
    description:
      "Code Combos is more than just a collection of tools; its a launchpad for innovation. Our platform offers a comprehensive tech stack that empowers you to explore new trends, test cutting-edge technologies, and develop skills that are in high demand in the industry.",
    href: "#",
    icon: ComputerDesktopIcon,
  },
  {
    name: "Project Ideation",
    description:
      "Building your own projects is a journey of personal and professional growth. Code Combos assists in sparking that creativity with a plethora of project ideas, designed to challenge and enhance your coding prowess. We're here to help kickstart your development voyage.",
    href: "#",
    icon: LightBulbIcon,
  },
];

export default function HomePageContent() {
  return (
    <div className="bg-white py-24 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Empower Your Development
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Unleash Your Potential with Code Combos
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Whether you&apos;re taking your first steps in web development or looking
            to sharpen your existing skills, Code Combos provides the resources
            and guidance needed to elevate your projects from concept to code.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon
                    className="h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="bg-white">
  <div className="px-6 py-24 sm:px-6 sm:py-8 lg:px-8">
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Ready to build your own tech stack?
        <br />
        Start customizing with Code Combos.
      </h2>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
        Skip the hassle of setup and configuration. Select, customize, and deploy your perfect tech stack with just a few clicks.
      </p>
      <div className="mt-10">
        <a
          href="/createstack/"
          className="rounded-md bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-lg hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 transition ease-in-out duration-150"
          style={{ fontSize: '1.125rem', lineHeight: '1.75rem' }} // Tailwind classes for text-lg and leading-snug
        >
          Get your stack
        </a>
      </div>
    </div>
  </div>
</div>

      </div>
    </div>
  );
}
