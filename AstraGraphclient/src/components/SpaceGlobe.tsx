import React, { useEffect, useRef, useState } from 'react';
import { Viewer, Cartesian3, Color, Entity } from 'cesium';
import { getDebrisObjects } from './services/api';

// Define the type for debris
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
    const [debris, setDebris] = useState<Debris[]>([]);

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

        // Define a color map for each OrbitRegime
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

        // Remove previous entities
        viewer.entities.removeAll();

        // Add debris entities to the viewer
        debris.forEach((obj) => {
            const color = orbitRegimeColors[obj.orbitRegime] || Color.WHITE;
            viewer.entities.add(
                new Entity({
                    position: Cartesian3.fromDegrees(obj.longitude, obj.latitude, obj.altitude),
                    point: {
                        pixelSize: 5,
                        color: color,
                    },
                    name: obj.name,
                    description: `Type: ${obj.type}<br>Orbit: ${obj.orbitRegime}`,
                })
            );
        });

        return () => {
            viewer.entities.removeAll();
        };
    }, [debris]);

    return <div id="cesiumContainer" style={{ width: '100%', height: '100vh' }} />;
};

export default CesiumGlobe;
