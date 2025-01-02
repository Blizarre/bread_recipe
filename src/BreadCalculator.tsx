import { useState, useEffect } from 'react'

type FormField = {
    id: string
    label: string
    defaultValue: number
    unit: string
    getter: () => number
    setter: (value: number) => void
}

const BreadCalculator = () => {
    const [initialized, setInitialized] = useState(false)
    const [additionalFlour, setAdditionalFlour] = useState(750)
    const [starter, setStarter] = useState(100)
    const [waterPercentage, setWaterPercentage] = useState(68)
    const [saltPercentage, setSaltPercentage] = useState(1.8)

    const formFields: FormField[] = [
        {
            id: 'flour',
            label: 'Farine',
            defaultValue: 1000,
            unit: 'g',
            getter: () => additionalFlour,
            setter: setAdditionalFlour
        },
        {
            id: 'starter',
            label: 'Levain',
            defaultValue: 200,
            unit: 'g',
            getter: () => starter,
            setter: setStarter
        },
        {
            id: 'water',
            label: "Pourcentage d'eau",
            defaultValue: 75,
            unit: '%',
            getter: () => waterPercentage,
            setter: setWaterPercentage
        },
        {
            id: 'salt',
            label: 'Pourcentage de sel',
            defaultValue: 2,
            unit: '%',
            getter: () => saltPercentage,
            setter: setSaltPercentage
        }
    ]

    // Load saved values at mount time
    useEffect(() => {
        formFields.forEach(field => {
            const savedValue = localStorage.getItem(`bread-${field.id}`)
            if (savedValue) {
                field.setter(Number(savedValue))
            }
        })
        setInitialized(true)
    }, [])

    // Save values to localStorage when they are changed
    useEffect(() => {
        if (!initialized) return

        formFields.forEach(field => {
            // Now we simply use the getter to access the current value
            const currentValue = field.getter()
            localStorage.setItem(`bread-${field.id}`, currentValue.toString())
        })
    }, [initialized, additionalFlour, starter, waterPercentage, saltPercentage])

    // Calculate the ingredients based on inputs
    const calculateIngredients = () => {
        const starterFlour = starter / 2
        const starterWater = starter / 2
        const totalFlour = additionalFlour + starterFlour
        const desiredWater = (totalFlour * waterPercentage) / 100
        const additionalWater = desiredWater - starterWater
        const salt = (totalFlour * saltPercentage) / 100

        // Calculate actual hydration rate based on total water and flour
        const totalWater = additionalWater + starterWater
        const actualHydration = (totalWater / totalFlour) * 100

        // Calculate additional statistics
        const actualSaltPercentage = (salt / totalFlour) * 100
        const starterPercentage = (starter / totalFlour) * 100
        const totalWeight = additionalFlour + additionalWater + salt + starter

        return {
            additionalFlour: Math.round(additionalFlour),
            additionalWater: Math.round(additionalWater),
            salt: salt.toFixed(1),
            hydrationRate: actualHydration.toFixed(1),
            saltRate: actualSaltPercentage.toFixed(2),
            starterRate: starterPercentage.toFixed(1),
            totalWeight: Math.round(totalWeight)
        }
    }

    const results = calculateIngredients()

    // Render the input fields
    const renderInputField = (field: FormField) => (
        <div key={field.id}>
            <label className="block mb-1">
                {field.label} ({field.unit})
            </label>
            <input
                type="number"
                value={field.getter()}
                onChange={(e) => field.setter(Number(e.target.value))}
                min="0"
                className="w-full p-2 border rounded"
            />
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Input Section - Contains all the user-adjustable parameters */}
            <section className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Calculateur de Pain</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formFields.map(renderInputField)}
                </div>
            </section>

            {/* Results Section - Shows the calculated ingredient amounts */}
            <section className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Ingrédients nécessaires</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Farine</p>
                        <p className="text-2xl font-semibold">{results.additionalFlour}g</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Eau</p>
                        <p className="text-2xl font-semibold">{results.additionalWater}g</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Sel</p>
                        <p className="text-2xl font-semibold">{results.salt}g</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Levain</p>
                        <p className="text-2xl font-semibold">{starter}g</p>
                    </div>
                </div>
            </section>

            {/* Statistics Section - Displays key dough characteristics */}
            <section className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Statistiques</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Taux d'hydratation réel</p>
                        <p className="text-2xl font-semibold">{results.hydrationRate}%</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Taux de sel réel</p>
                        <p className="text-2xl font-semibold">{results.saltRate}%</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Taux de levain</p>
                        <p className="text-2xl font-semibold">{results.starterRate}%</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Poids total</p>
                        <p className="text-2xl font-semibold">{results.totalWeight}g</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default BreadCalculator