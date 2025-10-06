import React from "react";

import { Play as PlayIcon } from "lucide-react";



const PlayOverlay = () => {

  return (

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">

        <div className="bg-primary/90 rounded-full p-4">

          <PlayIcon className="text-primary-foreground" />

        </div>

      </div>

  );

};



export default PlayOverlay;

