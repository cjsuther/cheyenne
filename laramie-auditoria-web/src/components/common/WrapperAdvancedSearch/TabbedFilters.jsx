import { forwardRef, useImperativeHandle, useState } from "react"
import { Tab, Tabs } from "../TabCustom"
import InputFilter from "./InputFilter"

const TabbedFilters = forwardRef(({ tabs, filters, formValues, handleInput, onTabChange, onEnter }, ref) => {
    const [activeKey, setActiveKey] = useState(tabs?.[0].title ?? '')

    useImperativeHandle(ref, () => ({
        activeTab: activeKey
    }))

    const onTabSelect = key => {
        setActiveKey(key)
        onTabChange(tabs.find(tab => tab.title === key))
    }

    return (
        <Tabs
            id="tabs-filters"
            activeKey={activeKey}
            onSelect={onTabSelect}
        >
            {tabs.map(tab => (
                <Tab
                    key={tab.title}
                    eventKey={tab.title}
                    title={tab.title}
                >
                    <div className="tab-panel">
                        <div className="row form-basic">
                            {tab.fields.map(field => (
                                <InputFilter key={field} {...{filter: filters[field], formValues, handleInput, onEnter }} />
                            ))}
                        </div>
                    </div>
                </Tab>
            ))}
        </Tabs>
    )
})

export default TabbedFilters
