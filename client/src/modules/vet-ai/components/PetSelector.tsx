import React from 'react';

interface PetSelectorProps {
    onChange: (petId: string) => void;
    selectedPetId?: string;
    placeholder?: string;
}

export const PetSelector: React.FC<PetSelectorProps> = ({ onChange, selectedPetId, placeholder }) => {
    // Mock data - replace with query to api.pets.myPets
    const pets = [
        { id: '1', name: 'Buddy (Dog)' },
        { id: '2', name: 'Mittens (Cat)' },
        { id: '3', name: 'Rocky (Hamster)' },
    ];

    return (
        <select
            className="w-full p-3 border rounded-lg bg-white"
            value={selectedPetId || ''}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="" disabled>{placeholder || 'Select a pet...'}</option>
            {pets.map(pet => (
                <option key={pet.id} value={pet.id}>
                    {pet.name}
                </option>
            ))}
        </select>
    );
};
