

export const getDebrisObjects = async () => {
    const response = await fetch('/api/spaceobjects/debris');
    if (!response.ok) throw new Error('Failed to fetch debris data');
    return response.json();
};
