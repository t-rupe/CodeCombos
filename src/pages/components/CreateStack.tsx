import { Fragment, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { api } from "../../utils/api";
import { get } from "http";

type SelectedOptionsType = Record<string, string>;

const filters = [
  {
    id: "frontend",
    name: "Frontend",
    options: [
      { value: "react", label: "React", checked: false },
      { value: "angular", label: "Angular", checked: false },
      { value: "vue", label: "Vue.js", checked: false },
      { value: "svelte", label: "Svelte", checked: false },
    ],
  },
  {
    id: "backend",
    name: "Backend",
    options: [
      { value: "nodejs", label: "Node.js", checked: false },
      { value: "django", label: "Django", checked: false },
      { value: "rubyonrails", label: "Ruby on Rails", checked: false },
      { value: "spring", label: "Spring", checked: false },
    ],
  },
  {
    id: "database",
    name: "Database",
    options: [
      { value: "postgresql", label: "PostgreSQL", checked: false },
      { value: "mongodb", label: "MongoDB", checked: false },
      { value: "mysql", label: "MySQL", checked: false },
      { value: "redis", label: "Redis", checked: false },
    ],
  },
  {
    id: "tools",
    name: "Additional Tools",
    options: [
      { value: "docker", label: "Docker", checked: false },
      { value: "kubernetes", label: "Kubernetes", checked: false },
      { value: "jenkins", label: "Jenkins", checked: false },
      { value: "webpack", label: "Webpack", checked: false },
    ],
  },
];
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function CreateStack() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsType>({
    frontend: "",
    backend: "",
    database: "",
    tools: "",
  });

  const handleOptionChange = (
    category: keyof SelectedOptionsType,
    value: string,
  ) => {
    setSelectedOptions((prev) => ({
      ...prev,
      // Ensure that a string is passed, even when unchecking an option
      [category]: prev[category] === value ? "" : value,
    }));
  };

  const isOptionDisabled = (
    category: keyof SelectedOptionsType,
    value: string,
  ): boolean => {
    return !!selectedOptions[category] && selectedOptions[category] !== value;
  };

  const [projectGenerated, setProjectGenerated] = useState(false);
  const [projectIdea, setProjectIdea] = useState<string | null>(null);
  const generateProjectIdea =
    api.generateRandomIdea.generateProjectIdea.useMutation();
  const [parsedData, setParsedData] = useState({
    frontend: "",
    backend: "",
    database: "",
    tools: [],
    projectIdea: "",
  });

  const handleGenerateProject = async () => {
    try {
      const result = await generateProjectIdea.mutateAsync({}); // Call API
      const parsed = parseResponse(result); // Parse the response
      setParsedData(parsed); // Set the parsed data to state
      setProjectGenerated(true); // Update state to show the project idea
    } catch (error) {
      console.error("Error generating project:", error);
      // Handle error state
    }
  };
  const handleBack = () => {
    // Reset the state related to the generated project idea
    setProjectGenerated(false);
    setProjectIdea(null);

    // If there are additional states to reset (like form fields or selections),
    // reset them here as well
  };
  const parseResponse = (response) => {
    // Initialize an object to hold parsed data
    const parsedData = {
      frontend: '',
      backend: '',
      database: '',
      tools: [],
      projectTitle: '',
      projectIdea: '',
    };
  
    // Split the response into lines
    const lines = response.split(/\r?\n/);
  
    // Iterate over the lines and parse the content
    lines.forEach((line, index) => {
      if (line.startsWith('🚀 Project Idea:')) {
        // Capture the project title
        parsedData.projectTitle = line.replace('🚀 Project Idea:', '').trim();
      } else if (line.startsWith('The')) {
        // Start capturing the project idea from this line until the end of the paragraph
        parsedData.projectIdea += line.trim() + ' ';
        let nextLine = lines[index + 1];
        while (nextLine && !nextLine.startsWith('🔧')) {
          parsedData.projectIdea += nextLine.trim() + ' ';
          nextLine = lines[++index + 1];
        }
      } else if (line.includes('Frontend Technology:')) {
        parsedData.frontend += line.split('Frontend Technology:')[1].trim() + '\n';
      } else if (line.includes('Backend Technology:')) {
        parsedData.backend += line.split('Backend Technology:')[1].trim() + '\n';
      } else if (line.includes('Database:')) {
        parsedData.database += line.split('Database:')[1].trim() + '\n';
      } else if (line.includes('Additional Tools:')) {
        // Do nothing, as the following lines will be captured as tools
      } else if (line.trim() && !line.includes('Category:') && !line.includes('Difficulty:') && !line.includes('Use Case:') && !line.includes('Documentation:')) {
        // This captures the technology names for the tools section
        parsedData.tools.push(line.trim());
      }
    });
  
    // Remove the last whitespace from the project idea if it exists
    parsedData.projectIdea = parsedData.projectIdea.trim();
  
    return parsedData;
  };
    // JSX to render the structured data
    const renderSection = (sectionData, emoji, title) => {
      // Split the section data into lines
      const lines = sectionData.split('\n');
    
      // Return a JSX element for the section
      return (
        <div>
          <h3 className="text-md font-semibold text-gray-900">
            {emoji} {title}:
          </h3>
          {lines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      );
    };

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    {filters.map((section) => (
                      <Disclosure
                        as="div"
                        key={section.id}
                        className="border-t border-gray-200 px-4 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">
                                  {section.name}
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {section.options.map((option, optionIdx) => (
                                  <div
                                    key={option.value}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      defaultValue={option.value}
                                      type="checkbox"
                                      defaultChecked={option.checked}
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                      className="ml-3 min-w-0 flex-1 text-gray-500"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Project Generator
            </h1>
          </div>
          <section aria-labelledby="stack-heading" className="pt-6">
            <h2 id="stack-heading" className="sr-only">
              Customize your stack
            </h2>
            <div className="flex gap-x-8 gap-y-10 ">
              {/* Filters */}
              <form className="hidden lg:block">
                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-b border-gray-200 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {section.options.map((option, optionIdx) => {
                              const disabled = isOptionDisabled(
                                section.id,
                                option.value,
                              );
                              return (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`filter-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    value={option.value}
                                    type="checkbox"
                                    checked={
                                      selectedOptions[section.id] ===
                                      option.value
                                    }
                                    disabled={disabled}
                                    onChange={() =>
                                      handleOptionChange(
                                        section.id,
                                        option.value,
                                      )
                                    }
                                    className={classNames(
                                      "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500",
                                      disabled
                                        ? "cursor-not-allowed opacity-50"
                                        : "",
                                    )}
                                  />
                                  <label
                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                    className={classNames(
                                      "ml-3 text-sm",
                                      disabled
                                        ? "text-gray-400"
                                        : "text-gray-600",
                                    )}
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>
              <div className="flex flex-col items-center justify-center">
                {projectGenerated ? (
                  // Display the generated project idea

                  <div id="content" className="border p-6 lg:col-span-3 ">
                    <div className="space-y-4">
                      <button
                        type="button"
                        className="mt-4 rounded-md bg-gray-200 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                        onClick={handleBack}
                      >
                        ← Back to Customization
                      </button>

                      {projectGenerated && (
                        <div id="content" className="border p-6 lg:col-span-3">
    <h2 className="text-2xl font-bold text-indigo-600">
      🚀 Project Idea: {parsedData.projectTitle}
    </h2>
    <p className="text-gray-600">
      {parsedData.projectIdea}
    </p>
    <h2 className="text-lg font-semibold text-gray-900">
      🔧 Tech Stack:
    </h2>
    {renderSection(parsedData.frontend, "🌐", "Frontend Technology")}
    {renderSection(parsedData.backend, "💾", "Backend Technology")}
    {renderSection(parsedData.database, "🗄️", "Database")}
    <h3 className="text-md font-semibold text-gray-900">
      🛠️ Additional Tools:
    </h3>
    {parsedData.tools.map((tool, index) => (
      <p key={index}>{tool}</p>
    ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Display the instructions for stack customization
                  <div id="content" className="border p-6">
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        How to Customize Your Stack
                      </h2>
                      <p className="text-gray-600">
                        Welcome to the Project Generator! Follow these steps to
                        customize the tech stack for your new project:
                      </p>
                      <ol className="list-inside list-decimal space-y-2">
                        <li>
                          Select the frontend framework you&apos;d like to use
                          for your project.
                        </li>
                        <li>
                          Choose the backend technology from the available
                          options.
                        </li>
                        <li>
                          Decide on the database that best fits your data
                          storage needs.
                        </li>
                        <li>
                          Check any additional tools or libraries you want to
                          include.
                        </li>
                      </ol>
                      <p className="text-gray-600">
                        As you make your selections, options that are not
                        compatible will be disabled to ensure the integrity of
                        your tech stack. Once you&apos;re satisfied with your
                        choices, click on the &apos;Generate Project&apos;
                        button to create your custom setup.
                      </p>
                      <p className="text-sm text-gray-500">
                        Note: You can always change your selections before
                        finalizing your project.
                      </p>
                      <button
                        type="button"
                        className="mt-4 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={handleGenerateProject}
                      >
                        Generate Project
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
