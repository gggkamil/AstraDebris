import { useEffect, useState } from "react";
const AstraGraph = () => {
    const [dataSources, setDataSources] = useState<string[]>([]);
    const [origins, setOrigins] = useState<string[]>([]);
    const [selectedRegime, setSelectedRegime] = useState("ALL");
    const [debrisToggle, setDebrisToggle] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    useEffect(() => {
      fetch("/api/datasources")
        .then((res) => res.json())
        .then(setDataSources);
  
      fetch("/api/origins")
        .then((res) => res.json())
        .then(setOrigins);
    }, []);
  
    return (
      <div className="astra-container">
        <div id="Loader"></div>
        <div id="MainDisplay"></div>
        <div id="InputsDiv">
          <div className="logo-section">
            <h1>AstraGraph</h1>
          </div>
  
          <fieldset>
            <legend>Resident space object search criteria</legend>
            <input type="text" id="SearchBox" placeholder="Search by name..." />
  
            <label>Data source</label>
            <select>
              {dataSources.map((src) => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
  
            <label>Country of origin</label>
            <select>
              {origins.map((origin) => (
                <option key={origin} value={origin}>{origin}</option>
              ))}
            </select>
  
            <label>Orbit regime</label>
            <select value={selectedRegime} onChange={(e) => setSelectedRegime(e.target.value)}>
              <option value="ALL">All</option>
              <option value="LEO">Low Earth orbit (LEO)</option>
              <option value="MEO">Medium Earth orbit (MEO)</option>
              <option value="GEO">Geo-synchronous/stationary orbit (GSO/GEO)</option>
              <option value="HEO">High Earth orbit (HEO)</option>
            </select>
  
            <label>
              <input type="checkbox" checked={debrisToggle} onChange={() => setDebrisToggle(!debrisToggle)} />
              Display rocket bodies and debris
            </label>
          </fieldset>
        </div>

  
      </div>
    );
  };
  
  export default AstraGraph;