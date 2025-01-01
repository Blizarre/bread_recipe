import { useState, useEffect } from 'react'

// The BreadCalculator remains a self-contained component for bread recipe calculations
const BreadCalculator = () => {
    // State management with localStorage persistence
    const [initialized, setInitialized] = useState(false)
    const [additionalFlour, setAdditionalFlour] = useState(750)
    const [starter, setStarter] = useState(100)
    const [waterPercentage, setWaterPercentage] = useState(68)
    const [saltPercentage, setSaltPercentage] = useState(1.8)

    // Load saved values on component mount
    useEffect(() => {
        const savedFlour = localStorage.getItem('bread-flour')
        const savedStarter = localStorage.getItem('bread-starter')
        const savedWater = localStorage.getItem('bread-water')
        const savedSalt = localStorage.getItem('bread-salt')

        if (savedFlour) setAdditionalFlour(Number(savedFlour))
        if (savedStarter) setStarter(Number(savedStarter))
        if (savedWater) setWaterPercentage(Number(savedWater))
        if (savedSalt) setSaltPercentage(Number(savedSalt))
        setInitialized(true)
    }, [])

    // Save values when they change
    useEffect(() => {
        if (!initialized) return
        localStorage.setItem('bread-flour', additionalFlour.toString())
        localStorage.setItem('bread-starter', starter.toString())
        localStorage.setItem('bread-water', waterPercentage.toString())
        localStorage.setItem('bread-salt', saltPercentage.toString())
    }, [initialized, additionalFlour, starter, waterPercentage, saltPercentage])

    // Calculate the required ingredients based on user inputs
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

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Input Section */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Calculateur de Pain</h2>

                <div className="grid grid-cols-2 gap-4">
                    {/* Flour Input */}
                    <div>
                        <label className="block mb-1">
                            Farine (g)
                        </label>
                        <input
                            type="number"
                            value={additionalFlour}
                            onChange={(e) => setAdditionalFlour(Number(e.target.value))}
                            min="0"
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Starter Input */}
                    <div>
                        <label className="block mb-1">
                            Levain (g)
                        </label>
                        <input
                            type="number"
                            value={starter}
                            onChange={(e) => setStarter(Number(e.target.value))}
                            min="0"
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Water Percentage Input */}
                    <div>
                        <label className="block mb-1">
                            Pourcentage d'eau (%)
                        </label>
                        <input
                            type="number"
                            value={waterPercentage}
                            onChange={(e) => setWaterPercentage(Number(e.target.value))}
                            min="0"
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Salt Percentage Input */}
                    <div>
                        <label className="block mb-1">
                            Pourcentage de sel (%)
                        </label>
                        <input
                            type="number"
                            value={saltPercentage}
                            onChange={(e) => setSaltPercentage(Number(e.target.value))}
                            min="0"
                            className="w-full p-2 border rounded"
                        />
                    </div>
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