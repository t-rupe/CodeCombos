import { Fragment, useState, useEffect } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { api } from "../../utils/api";
import { createClient } from "@supabase/supabase-js"; 
import axios from "axios";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'undefined'; 
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    setSelectedOptions((prev) => {
      const newOptions = { ...prev, [category]: prev[category] === value ? "" : value };
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
  const [partnerURLs, setPartnerURLs] = useState({});

  const [projectIdea, setProjectIdea] = useState({
    title: '',
    description: '',
    urls: '',
    frontend_technology_id: '',
    backend_technology_id: '',
    database_id: '',
    styling_library_id: '',
    deployment_id: '',
  });

  const fetchRandomProjectIdea = async () => {
    // Generate a random number between 3 and 22 (1 to 10 as per your requirement)
    const randomId = Math.floor(Math.random() * 20) + 3;
  
    const { data, error } = await supabase
      .from('project_ideas')
      .select('*')
      .eq('id', randomId)
      .single();
  
    if (error) {
      console.error('Error fetching project idea:', error);
      return null;
    }
    return data;
  };

  const fetchPartnerURLs = async (input) => {
    try {
      const response = await axios.post('https://elitemma.vercel.app/api/partner/geturl', {
        frontend: input.frontendId,
        backend: input.backendId,
        database: input.databaseId,
        styling: input.stylingLibraryId,
        deployment: input.deploymentId
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch URLs: ${error}`);
      throw new Error(`Failed to fetch URLs: ${error}`);
    }
  };
  
  
  
  const fetchTechnology = async (table:string, id: number) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
  
    if (error) {
      console.error(`Error fetching ${table} with id ${id}:`, error);
      return null;
    }
    return data;
  };
  
  useEffect(() => {
    const fetchAllData = async () => {
      // Fetch the random project idea
      const projectIdeaData = await fetchRandomProjectIdea();
  
      if (projectIdeaData) {
        setProjectIdea(projectIdeaData);
        console.log("Project Idea:", projectIdeaData);
  
        // Fetch technologies using the project idea data
        const frontendTech = await fetchTechnology('frontend_technologies', projectIdeaData.frontend_technology_id);
        const backendTech = await fetchTechnology('backend_technologies', projectIdeaData.backend_technology_id);
        const databaseTech = await fetchTechnology('databases', projectIdeaData.database_id);
        const stylingLib = await fetchTechnology('styling_libraries', projectIdeaData.styling_library_id);
        const deploymentTech = await fetchTechnology('deployment', projectIdeaData.deployment_id);
  
        // Store technologies in state or use them as needed
        if (frontendTech) {
          // Handle frontendTech data
        }
        if (backendTech) {
          // Handle backendTech data
        }
        if (databaseTech) {
          // Handle databaseTech data
        }
        if (stylingLib) {
          // Handle stylingLib data
        }
        if (deploymentTech) {
          // Handle deploymentTech data
        }
  
        // Prepare input for partnerURLs
        console.log
        const input = {
          frontend: projectIdeaData.frontend_technology_id,
          backend: projectIdeaData.backend_technology_id,
          database: projectIdeaData.database_id,
          styling: projectIdeaData.styling_library_id,
          deployment: projectIdeaData.deployment_id
        };
        console.log("input", input)
  
        // Fetch partner URLs
        const partnerURLData = await fetchPartnerURLs(input);
  
        if (partnerURLData) {
          // Store partner URLs in state
          setPartnerURLs(partnerURLData);
          console.log("Partner URLs:", partnerURLData);
        }
      }
    };
  
    // Fetch all data when component mounts
    fetchAllData();
  }, []);
 


  return (
    <div className="bg-white">
    hi 
    </div>
  );
}
