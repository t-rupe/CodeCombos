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

// Define this type according to the structure of your options
interface SelectedOptionsType {
  frontend: string;
  backend: string;
  database: string;
  tools: string;
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
    setSelectedOptions((prev) => {
      const newOptions = {
        ...prev,
        [category]: prev[category] === value ? "" : value,
      };
      console.log("New Options:", newOptions);
      return newOptions;
    });
  };

  const isOptionDisabled = (
    category: keyof SelectedOptionsType,
    value: string,
  ): boolean => {
    return !!selectedOptions[category] && selectedOptions[category] !== value;
  };

  const [projectGenerated, setProjectGenerated] = useState(false);
  const [partnerURLs, setPartnerURLs] = useState<PartnerURLs>({});

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

  const handleGenerateProject = async () => {

    const fetchPartnerURLs = async (input: PartnerURLsInput): Promise<PartnerURLs> => {
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

    // Fetch the project idea from your database
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

    // Fetch the URLs from the partner's microservice
     try {
    const partnerURLData = await fetchPartnerURLs(input);
    setPartnerURLs(partnerURLData); // partnerURLData is now correctly typed as PartnerURLs
    setProjectGenerated(true);
  } catch (error) {
    console.error("Failed to fetch URLs from partner microservice:", error);
  }}


  
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


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow">
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
              dangerouslySetInnerHTML={{ __html: projectIdea.description }}
            />
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Technologies Used:</h3>
              <ul className="mt-2 list-inside list-disc space-y-2">
              {partnerURLs && Object.entries(partnerURLs).map(([tech, url]) => (
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

            {/* Render additional project details andtech stack URLs */}
          </>
        ) : (
          // Display the instructions for stack customization
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              How to Customize Your Stack
            </h2>
            <p className="text-gray-600">
              Welcome to the Project Generator! Follow these steps to customize
              the tech stack for your new project.
            </p>
            <button
              type="button"
              className="mt-4 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleGenerateProject}
            >
              Generate Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
