import { Fragment, useState, useEffect } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import { api } from "../../utils/api";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "undefined";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "undefined";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ProjectIdea {
  title: string;
  description: string;
  urls: string;
  frontend_technology_id: number;
  backend_technology_id: number;
  database_id: number;
  styling_library_id: number;
  deployment_id: number;
}

interface PartnerURLs {
  [key: string]: string;
}

interface SelectedOptionsType {
  frontend: string;
  backend: string;
  database: string;
}

export default function CreateStack() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsType>({
    frontend: "",
    backend: "",
    database: "",
  });

  const handleOptionChange = (
    category: keyof SelectedOptionsType,
    value: string,
  ) => {
    // Reset other options when one is selected
    setSelectedOptions({
      frontend: "",
      backend: "",
      database: "",
      [category]: value,
    });
  };

  const filters = [
    {
      id: "frontend",
      name: "Frontend",
      options: [
        { value: "react", label: "React", checked: false },
        { value: "vue", label: "Vue", checked: false },
        { value: "angular", label: "Angular", checked: false },
      ],
    },
    {
      id: "backend",
      name: "Backend",
      options: [
        { value: "nodejs", label: "Node.js", checked: false },
        { value: "ruby", label: "Ruby on Rails", checked: false },
        { value: "flask", label: "Flask", checked: false },
      ],
    },
    {
      id: "database",
      name: "Database",
      options: [
        { value: "mongodb", label: "MongoDB", checked: false },
        { value: "postgresql", label: "PostgreSQL", checked: false },
        { value: "mysql", label: "MySQL", checked: false },
      ],
    },
  ];

  const isOptionDisabled = (
    category: keyof SelectedOptionsType,
    value: string,
  ): boolean => {
    return !!selectedOptions[category] && selectedOptions[category] !== value;
  };

  const [projectGenerated, setProjectGenerated] = useState(false);
  const [partnerURLs, setPartnerURLs] = useState<PartnerURLs>({});
  const [isLoading, setIsLoading] = useState(false); // New state for loading status

  interface ProjectIdea {
    title: string;
    description: string;
    urls: string;
    frontend_technology_id: number;
    backend_technology_id: number;
    database_id: number;
    styling_library_id: number;
    deployment_id: number;
  }

  const [projectIdea, setProjectIdea] = useState<ProjectIdea>({
    title: "",
    description: "",
    urls: "",
    frontend_technology_id: 1,
    backend_technology_id: 1,
    database_id: 1,
    styling_library_id: 1,
    deployment_id: 1,
  });

  interface PartnerURLsInput {
    frontendId: number;
    backendId: number;
    databaseId: number;
    stylingLibraryId: number;
    deploymentId: number;
  }

  const fetchTechnology = async (table: string, id: number) => {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching ${table} with id ${id}:`, error);
      return null;
    }
    return data;
  };
  const getTechnologyId = (category, value) => {
    const mappings = {
      frontend: { react: 1, vue: 3, angular: 4 },
      backend: { nodejs: 1, ruby: 3, flask: 6 },
      database: { postgresql: 1, mysql: 2, mongodb: 3 },
    };

    return mappings[category][value] || null;
  };

  const fetchPartnerURLs = async (
    input: PartnerURLsInput,
  ): Promise<PartnerURLs> => {
    try {
      const response = await axios.post("/api/serverfetch", {
        frontend: input.frontendId,
        backend: input.backendId,
        database: input.databaseId,
        styling: input.stylingLibraryId,
        deployment: input.deploymentId,
      });

      console.log("response from partner microservice", response.data);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch URLs: ${error}`);
      throw new Error(`Failed to fetch URLs: ${error}`);
    }
  };

  const handleGenerateProject = async () => {
    setIsLoading(true); // Set loading to true when operation starts

    try {
      // Determine which technology category is selected and its value
      let selectedCategory = "";
      let selectedValue = "";
      for (const [key, value] of Object.entries(selectedOptions)) {
        if (value) {
          selectedCategory = key;
          selectedValue = value;
          break;
        }
      }

      if (!selectedCategory) {
        alert("No technology selected");
        return;
      }

      console.log("Selected category:", selectedCategory);
      console.log("Selected value:", selectedValue);

      // Get the corresponding technology ID
      const technologyId = getTechnologyId(selectedCategory, selectedValue);
      if (!technologyId) {
        console.error("Invalid technology selected");
        return;
      }

      const columnName =
        selectedCategory === "database"
          ? "database_id"
          : `${selectedCategory}_technology_id`;

      const { data, error } = await supabase
        .from("project_ideas")
        .select("*")
        .eq(columnName, technologyId);

      if (error) throw error;

      if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const selectedProjectIdea = data[randomIndex] as ProjectIdea;
        setProjectIdea(selectedProjectIdea);
        console.log("Project Idea:", selectedProjectIdea);

        const partnerURLData = await fetchPartnerURLs({
          frontendId: selectedProjectIdea.frontend_technology_id,
          backendId: selectedProjectIdea.backend_technology_id,
          databaseId: selectedProjectIdea.database_id,
          stylingLibraryId: selectedProjectIdea.styling_library_id,
          deploymentId: selectedProjectIdea.deployment_id,
        });

        setPartnerURLs(partnerURLData);
        setProjectGenerated(true);
      } else {
        console.error("No matching project idea found");
      }
    } catch (error) {
      console.error("Error in handleGenerateProject:", error);
    }
    setIsLoading(false); // Set loading to false when operation is completed
  };

  const handleBack = () => {
    setProjectGenerated(false);
    setProjectIdea({
      title: "",
      description: "",
      urls: "",
      frontend_technology_id: 1,
      backend_technology_id: 1,
      database_id: 1,
      styling_library_id: 1,
      deployment_id: 1,
    });
    setPartnerURLs({});
  };

  const handleRandomizeSelection = async () => {
    setIsLoading(true); // Set loading to true when operation starts

    const fetchPartnerURLs = async (
      input: PartnerURLsInput,
    ): Promise<PartnerURLs> => {
      try {
        const response = await axios.post("/api/serverfetch", {
          frontend: input.frontendId,
          backend: input.backendId,
          database: input.databaseId,
          styling: input.stylingLibraryId,
          deployment: input.deploymentId,
        });

        console.log("response from partner microservice", response.data);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch URLs: ${error}`);
        throw new Error(`Failed to fetch URLs: ${error}`);
      }
    };

    // Generate a random ID for the project idea
    const randomId = Math.floor(Math.random() * 17) + 1;

    const { data, error } = await supabase
      .from("project_ideas")
      .select("*")
      .eq("id", randomId)
      .single();

    if (error) {
      console.error("Error fetching project idea:", error);
      return;
    }

    // Set the fetched project idea to state
    setProjectIdea(data);
    console.log("Project Idea:", data);

    const input: PartnerURLsInput = {
      frontendId: data.frontend_technology_id,
      backendId: data.backend_technology_id,
      databaseId: data.database_id,
      stylingLibraryId: data.styling_library_id,
      deploymentId: data.deployment_id,
    };

    // Fetch the URLs from microservice
    try {
      const partnerURLData = await fetchPartnerURLs(input);
      setPartnerURLs(partnerURLData);
      setProjectGenerated(true);
    } catch (error) {
      console.error("Failed to fetch URLs from partner microservice:", error);
    }
    setIsLoading(false); // Set loading to false when operation is completed
  };

  return (
    <div>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Stack Customization
          </h1>
          {/* Other header elements */}
        </div>

        <section aria-labelledby="stack-heading" className="pb-24 pt-6">
          <h2 id="stack-heading" className="sr-only">
            Stack Customization Options
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
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
                          {section.options.map((option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                id={`filter-${section.id}-${optionIdx}`}
                                name={`${section.id}[]`}
                                defaultValue={option.value}
                                type="checkbox"
                                checked={
                                  selectedOptions[section.id] === option.value
                                }
                                onChange={() =>
                                  handleOptionChange(
                                    section.id as keyof SelectedOptionsType,
                                    option.value,
                                  )
                                }
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`filter-${section.id}-${optionIdx}`}
                                className="ml-3 text-sm text-gray-600"
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

            <div className="lg:col-span-3">
              <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow">
                {isLoading ? (
                  // Show loading spinner when content is loading
                  <div className="relative block max-w-sm items-center rounded-lg border border-gray-100 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <div
                      role="status"
                      className="absolute left-1/2 top-2/4 -translate-x-1/2 -translate-y-1/2"
                    >
                      <svg
                        aria-hidden="true"
                        className="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>

                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    {projectGenerated ? (
                      // Display the generated project idea
                      <>
                        <div className="space-y-4">
                          <button
                            type="button"
                            className="mb-4 rounded-md bg-gray-200 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                            onClick={handleBack}
                          >
                            ← Back to Customization
                          </button>
                        </div>
                        <h2 className="text-2xl font-bold text-indigo-600">
                          🚀 Project Idea: {projectIdea.title}
                        </h2>
                        <div
                          className="prose prose-indigo mt-4"
                          dangerouslySetInnerHTML={{
                            __html: projectIdea.description,
                          }}
                        />
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold">
                            Technologies Used:
                          </h3>
                          <ul className="mt-2 list-inside list-disc space-y-2">
                            {partnerURLs &&
                              Object.entries(partnerURLs).map(([tech, url]) => (
                                <li key={tech}>
                                  <a
                                    href={url}
                                    className="text-indigo-600 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {tech}: {url}
                                  </a>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                          How to Customize Your Stack
                        </h2>
                        <p className="text-gray-600">
                          Welcome to the Project Generator! This tool allows you
                          to customize the tech stack for your new project.
                          Follow these simple steps:
                        </p>
                        <ul className="list-inside list-disc text-gray-600">
                          <li>
                            Select only one technology from each of the filter
                            categories: Frontend, Backend, and Database.
                          </li>
                          <li>
                            Once you've made your selection, click the 'Generate
                            Project' button to obtain a coding combination that
                            utilizes your selected technology.
                          </li>
                          <li>
                            Not sure which filters to choose? Use the 'Randomize
                            Selection' button to generate a random coding combo!
                          </li>
                        </ul>
                        <div className="mt-4 flex space-x-4">
                          <button
                            type="button"
                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleGenerateProject}
                          >
                            Generate Project
                          </button>
                          <button
                            type="button"
                            className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                            onClick={handleRandomizeSelection}
                          >
                            Randomize Selection
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
