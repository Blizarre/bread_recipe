import { useState, useEffect } from 'react'

// An empty input is represented by null, so that clearing a field does not turn into 0
type NumericValue = number | null

type FormField = {
    id: string
    label: string
    section: 'ingredients' | 'temperature'
    getter: () => NumericValue
    setter: (value: NumericValue) => void
}

const loadSavedValue = (id: string, fallback: number): NumericValue => {
    const savedValue = localStorage.getItem(`bread-${id}`)
    if (savedValue === null) return fallback
    if (savedValue === '') return null
    const parsedValue = Number(savedValue)
    return Number.isNaN(parsedValue) ? fallback : parsedValue
}

const BreadCalculator = () => {
    const [additionalFlour, setAdditionalFlour] = useState<NumericValue>(() => loadSavedValue('flour', 750))
    const [starter, setStarter] = useState<NumericValue>(() => loadSavedValue('starter', 100))
    const [waterPercentage, setWaterPercentage] = useState<NumericValue>(() => loadSavedValue('water', 68))
    const [saltPercentage, setSaltPercentage] = useState<NumericValue>(() => loadSavedValue('salt', 1.8))
    const [baseTemperature, setBaseTemperature] = useState<NumericValue>(() => loadSavedValue('base-temperature', 65))
    const [flourTemperature, setFlourTemperature] = useState<NumericValue>(() => loadSavedValue('flour-temperature', 20))
    const [roomTemperature, setRoomTemperature] = useState<NumericValue>(() => loadSavedValue('room-temperature', 20))

    const formFields: FormField[] = [
        {
            id: 'flour',
            label: 'Farine (g)',
            section: 'ingredients',
            getter: () => additionalFlour,
            setter: setAdditionalFlour
        },
        {
            id: 'starter',
            label: 'Levain (50% eau, 50% farine, g)',
            section: 'ingredients',
            getter: () => starter,
            setter: setStarter
        },
        {
            id: 'water',
            label: "Pourcentage d'eau (%)",
            section: 'ingredients',
            getter: () => waterPercentage,
            setter: setWaterPercentage
        },
        {
            id: 'salt',
            label: 'Pourcentage de sel (%)',
            section: 'ingredients',
            getter: () => saltPercentage,
            setter: setSaltPercentage
        },
        {
            id: 'base-temperature',
            label: 'Température de base (TB, °C)',
            section: 'temperature',
            getter: () => baseTemperature,
            setter: setBaseTemperature
        },
        {
            id: 'flour-temperature',
            label: 'Température de la farine (°C)',
            section: 'temperature',
            getter: () => flourTemperature,
            setter: setFlourTemperature
        },
        {
            id: 'room-temperature',
            label: 'Température ambiante (°C)',
            section: 'temperature',
            getter: () => roomTemperature,
            setter: setRoomTemperature
        }
    ]

    // Save values to localStorage when they are changed
    useEffect(() => {
        const values: Record<string, NumericValue> = {
            flour: additionalFlour,
            starter,
            water: waterPercentage,
            salt: saltPercentage,
            'base-temperature': baseTemperature,
            'flour-temperature': flourTemperature,
            'room-temperature': roomTemperature
        }

        Object.entries(values).forEach(([id, value]) => {
            localStorage.setItem(`bread-${id}`, value === null ? '' : value.toString())
        })
    }, [additionalFlour, starter, waterPercentage, saltPercentage, baseTemperature, flourTemperature, roomTemperature])

    // Calculate the ingredients based on inputs
    const calculateIngredients = () => {
        const starterFlour = starter === null ? null : starter / 2
        const starterWater = starter === null ? null : starter / 2
        const totalFlour =
            additionalFlour === null || starterFlour === null
                ? null
                : additionalFlour + starterFlour
        const desiredWater =
            totalFlour === null || waterPercentage === null
                ? null
                : (totalFlour * waterPercentage) / 100
        const additionalWater =
            desiredWater === null || starterWater === null
                ? null
                : desiredWater - starterWater
        const salt =
            totalFlour === null || saltPercentage === null
                ? null
                : (totalFlour * saltPercentage) / 100

        // Calculate additional statistics
        const starterPercentage =
            starter === null || totalFlour === null || totalFlour === 0
                ? null
                : (starter / totalFlour) * 100
        const totalWeight =
            additionalFlour === null ||
            additionalWater === null ||
            salt === null ||
            starter === null
                ? null
                : additionalFlour + additionalWater + salt + starter

        return {
            additionalFlour: additionalFlour === null ? '-' : Math.round(additionalFlour).toString(),
            additionalWater: additionalWater === null ? '-' : Math.round(additionalWater).toString(),
            salt: salt === null ? '-' : salt.toFixed(1),
            hydrationRate: waterPercentage === null ? '-' : waterPercentage.toFixed(1),
            saltRate: saltPercentage === null ? '-' : saltPercentage.toFixed(2),
            starterRate: starterPercentage === null ? '-' : starterPercentage.toFixed(1),
            totalWeight: totalWeight === null ? '-' : Math.round(totalWeight).toString()
        }
    }

    const results = calculateIngredients()

    // The water temperature is the base temperature minus the flour and room temperatures
    const waterTemperature =
        baseTemperature === null || flourTemperature === null || roomTemperature === null
            ? '-'
            : (baseTemperature - flourTemperature - roomTemperature).toFixed(1)

    // A value that cannot be computed is shown as a dash, without a unit
    const withUnit = (value: string, unit: string) =>
        value === '-' ? '-' : `${value}${unit}`

    // Render the input fields
    const renderInputField = (field: FormField) => {
        const value = field.getter()
        return (
            <div key={field.id}>
                <label className="block mb-1">
                    {field.label}
                </label>
                <input
                    type="number"
                    value={value === null ? '' : value}
                    onChange={(e) => field.setter(e.target.value === '' ? null : Number(e.target.value))}
                    min="0"
                    className="w-full p-2 border rounded"
                />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Ingredients Section - Inputs and their calculated amounts */}
            <section className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Calculateur de Pain</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formFields.filter(field => field.section === 'ingredients').map(renderInputField)}
                </div>

                <h3 className="text-xl font-semibold mt-8 mb-4">Ingrédients nécessaires</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Farine</p>
                        <p className="text-2xl font-semibold">{withUnit(results.additionalFlour, 'g')}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Eau</p>
                        <p className="text-2xl font-semibold">{withUnit(results.additionalWater, 'g')}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Sel</p>
                        <p className="text-2xl font-semibold">{withUnit(results.salt, 'g')}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Levain</p>
                        <p className="text-2xl font-semibold">{starter === null ? '-' : `${starter}g`}</p>
                    </div>
                </div>
            </section>

            {/* Temperature Section - Computes the water temperature from the base temperature */}
            <section className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Température de base (TB)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {formFields.filter(field => field.section === 'temperature').map(renderInputField)}
                </div>
                <h3 className="text-xl font-semibold mt-8 mb-4">Température de l'eau</h3>
                <p className="text-2xl font-semibold">{withUnit(waterTemperature, '°C')}</p>
            </section>

            {/* Statistics Section - Displays key dough characteristics */}
            <section className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Statistiques</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Taux d'hydratation</p>
                        <p className="text-2xl font-semibold">{withUnit(results.hydrationRate, '%')}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Taux de sel</p>
                        <p className="text-2xl font-semibold">{withUnit(results.saltRate, '%')}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Taux de levain</p>
                        <p className="text-2xl font-semibold">{withUnit(results.starterRate, '%')}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Poids total</p>
                        <p className="text-2xl font-semibold">{withUnit(results.totalWeight, 'g')}</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default BreadCalculator