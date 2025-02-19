import React, { useEffect, useRef, useState } from 'react';
import { Viewer, Cartesian3, Color, Entity } from 'cesium';
import { getDebrisObjects } from './services/api';

interface Debris {
    name: string;
    type: string;
    orbitRegime: string;
    longitude: number;
    latitude: number;
    altitude: number;
}

const CesiumGlobe: React.FC = () => {
    const viewerRef = useRef<Viewer | null>(null);
    const initialFilters = {
        LEO: false,
        MEO: true,
        HEO: true,
        GEO: true,
        EGO: true,
        GTO: true,
        NSO: true,
        LMO: true,
        MGO: true,
        Other: true,
    };
    const descriptionOrbitial: { [key: string]: string } = {

        LEO: "Low Earth Orbit",
        MEO: "Medium Earth Orbit",
        HEO: "Highly Eccentric Earth Orbit",
        GEO: "Geostationary Orbit",
        EGO: "Extended Geostationary Orbit",
        GTO: "GEO Transfer Orbit",
        NSO: "Navigation Satellites Orbit",
        LMO: "LEO-MEO Crossing Orbits",
        MGO: "MEO-GEO Crossing Orbits",
        Other: "Undefined Orbit",
    };
    
    const [debris, setDebris] = useState<Debris[]>([]);
    const [filter, setFilter] = useState<{ [key: string]: boolean }>(initialFilters);

    useEffect(() => {
        const fetchDebris = async () => {
            try {
                const debrisData = await getDebrisObjects();
                setDebris(debrisData);
            } catch (error) {
                console.error('Error fetching debris data:', error);
            }
        };

        fetchDebris();
    }, []);

    useEffect(() => {
        if (!viewerRef.current) {
            viewerRef.current = new Viewer('cesiumContainer', {
                shouldAnimate: true,
            });
        }

        const viewer = viewerRef.current;

        const orbitRegimeColors: { [key: string]: Color } = {
            LEO: Color.RED,
            MEO: Color.GREEN,
            HEO: Color.ORANGE,
            GEO: Color.BLUE,
            EGO: Color.PURPLE,
            GTO: Color.YELLOW,
            NSO: Color.CYAN,
            LMO: Color.MAGENTA,
            MGO: Color.BROWN,
            Other: Color.GREY
        };

        viewer.entities.removeAll();

        debris.forEach((obj) => {
            if (filter[obj.orbitRegime]) {
                const color = orbitRegimeColors[obj.orbitRegime] || Color.WHITE;
                viewer.entities.add(
                    new Entity({
                        position: Cartesian3.fromDegrees(obj.longitude, obj.latitude, obj.altitude),
                        point: {
                            pixelSize: 5,
                            color: color,
                        },
                        name: obj.name,
                        description: `
                         <div style="background-color: black; color: white; padding: 10px; border-radius: 5px;">
                            <h3>${obj.name}</h3>
                            <b>Type:</b> ${obj.type}<br>
                            <b>Type desc:</b>${descriptionOrbitial[obj.orbitRegime]}<br>
                            <b>Orbit:</b> ${obj.orbitRegime}<br>
                            <b>Altitude:</b> ${obj.altitude.toLocaleString()} km<br>
                            <b>Longitude:</b> ${obj.longitude.toFixed(2)}<br>
                            <b>Latitude:</b> ${obj.latitude.toFixed(2)}<br>
                        </div>
                        `,
                    })
                );
            }
        });

        return () => {
            viewer.entities.removeAll();
        };
    }, [debris, filter]);

  
    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({ ...filter, [event.target.name]: event.target.checked });
    };

 
    const resetFilters = () => {
        setFilter(initialFilters);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <div style={{
                position: 'absolute',
                top: '150px',
                left: '80px',
                background: 'rgba(0, 0, 0, 0.8)',
                padding: '10px',
                borderRadius: '5px',
                color: 'white',
                zIndex: 1000,
                maxWidth: '200px'
            }}>
   
             
                <button 
                    onClick={resetFilters} 
                    style={{
                        width: '100%',
                        padding: '5px',
                        marginBottom: '8px',
                        background: 'white',
                        color: 'black',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}>
                    Reset
                </button>

                {Object.keys(filter).map((orbit) => {
                    const colorStyle = {
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        backgroundColor: orbit === "LEO" ? "red" :
                                        orbit === "MEO" ? "green" :
                                        orbit === "HEO" ? "orange" :
                                        orbit === "GEO" ? "blue" :
                                        orbit === "EGO" ? "purple" :
                                        orbit === "GTO" ? "yellow" :
                                        orbit === "NSO" ? "cyan" :
                                        orbit === "LMO" ? "magenta" :
                                        orbit === "MGO" ? "brown" :
                                        "grey",
                        marginRight: '5px',
                        borderRadius: '2px'
                    };
                    const tooltip = descriptionOrbitial[orbit] || "No description available";
                    return (
                        <label key={orbit} style={{ display: 'flex', alignItems: 'center', fontSize: '20px', marginBottom: '5px' }}>
                            <div style={colorStyle}></div>
                            <input
                                type="checkbox"
                                name={orbit}
                                checked={filter[orbit]}
                                onChange={handleFilterChange}
                                style={{ marginRight: '5px' }}
                                title={tooltip} 
                            />
                            {orbit}
                        </label>
                    );
                })}
            </div>

            {/* Cesium Globe */}
            <div id="cesiumContainer" style={{ width: '100%', height: '100vh' }} />
        </div>
    );
};

export default CesiumGlobe;
