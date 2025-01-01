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
            label: 'Farine supplémentaire',
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

        return {
            additionalFlour: Math.round(additionalFlour),
            additionalWater: Math.round(additionalWater),
            salt: salt.toFixed(1)
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
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Input Section */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Calculateur de Pain</h2>
                <div className="grid grid-cols-2 gap-4">
                    {formFields.map(renderInputField)}
                </div>
            </div>

            {/* Results Section */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Ingrédients nécessaires</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm">Farine</p>
                        <p className="text-2xl">{results.additionalFlour}g</p>
                    </div>
                    <div>
                        <p className="text-sm">Eau</p>
                        <p className="text-2xl">{results.additionalWater}g</p>
                    </div>
                    <div>
                        <p className="text-sm">Sel</p>
                        <p className="text-2xl">{results.salt}g</p>
                    </div>
                    <div>
                        <p className="text-sm">Levain</p>
                        <p className="text-2xl">{starter}g</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BreadCalculator