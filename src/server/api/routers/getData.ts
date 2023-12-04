// getData.ts

import axios from 'axios';
import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } 
from "~/server/api/trpc";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'undefined'; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getDataRouter = createTRPCRouter({
  // Fetch a random project idea
  getRandomProjectIdea: publicProcedure.query(async () => {
    const { data, error } = await supabase
      .from('project_ideas')
      .select('*')
      .order('random()')
      .limit(1)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }),

  // Fetch technology details by IDs and get URLs from the partner's microservice
  getTechnologyDetails: publicProcedure
    .input(z.object({
      frontendId: z.number(),
      backendId: z.number(),
      databaseId: z.number(),
      stylingLibraryId: z.number(),
      deploymentId: z.number()
    }))
    .query(async ({ input }) => {
      const fetchTechnology = async (table: string, id: number) => {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw new Error(error.message);
        return data;
      };

      const frontendTech = await fetchTechnology('frontend_technologies', input.frontendId);
      const backendTech = await fetchTechnology('backend_technologies', input.backendId);
      const databaseTech = await fetchTechnology('databases', input.databaseId);
      const stylingLib = await fetchTechnology('styling_libraries', input.stylingLibraryId);
      const deploymentTech = await fetchTechnology('deployment', input.deploymentId);

    
      return {
        frontendTech,
        backendTech,
        databaseTech,
        stylingLib,
        deploymentTech,
      };
    }),
});

