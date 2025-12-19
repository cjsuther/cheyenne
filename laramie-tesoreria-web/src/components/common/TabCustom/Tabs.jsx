import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Tabs as ReactBootstrap_Tabs, Tab as ReactBootstrap_Tab } from 'react-bootstrap';
import './index.scss';

const Tabs = (props) => {
  
  const refTabs = useRef(null);

  const [firstIndex, setFirstIndex] = useState(0);
  const [withComponent, setWithComponent] = useState(0);

  const handleResize = () => {
    const offsetWidth = refTabs.current ? refTabs.current.offsetWidth : 0;
    setWithComponent(offsetWidth);
  };

  useEffect(() => {

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    handleResize();
  }, [props]);


  const tabs = useMemo(() =>
    (props.children) ?
      React.Children.map(props.children, (child, index) => { 
        return {
          index: index,
          eventKey: child.props.eventKey,
          title: child.props.title,
          tabClassName: child.props.tabClassName ?? '',
          children: child.props.children
        }
    }) : [], [props.children, firstIndex]);

  const countCharTab = useMemo(() => {
    let countChar = 0;
    tabs.forEach(tab => countChar += tab.title.length);
    return countChar;
  }, [tabs]);

  const overflowTabs = useMemo(() => {
    let overflow = true;
    if (withComponent && countCharTab) {
      try {
        overflow = (withComponent < countCharTab * 11);
      }
      catch { }
    }
    //solo cuango habia overflow pero ya no hay, y firstIndex es mayor a cero
    if (!overflow && firstIndex > 0) {
      setFirstIndex(0);
    }
    return overflow;
  }, [withComponent, countCharTab])


  const handleBackward = (event) => {
    if (firstIndex - 1 >= 0) setFirstIndex(firstIndex - 1);
  }
  const handleForward = (event) => {
    if (firstIndex + 1 <= tabs.length - 1) setFirstIndex(firstIndex + 1);
  }

  const moveBackward = <span className="material-symbols-outlined search-i">chevron_left</span>
  const moveForward = <span className="material-symbols-outlined search-i">chevron_right</span>

  return (
      <div className='tab-custom-container'>

        {overflowTabs &&
        <>
          <div className={(firstIndex === 0) ? "tab-custom-backward tab-custom-disabled" : "tab-custom-backward link"} onClick={handleBackward}>{moveBackward}</div>
          <div className={(firstIndex === tabs.length - 1) ? "tab-custom-forward tab-custom-disabled" : "tab-custom-forward link"} onClick={handleForward}>{moveForward}</div>
        </>
        }

        <div ref={refTabs}>
          <ReactBootstrap_Tabs
            id={props.id}
            activeKey={props.activeKey}
            className={overflowTabs ? `${props.className} nav-tabs-with-overflow` : props.className}
            onSelect={props.onSelect}
            transition={false}
          >
          {
            tabs.map(tab => {
              return (
                <ReactBootstrap_Tab key={tab.index}
                  eventKey={tab.eventKey}
                  title={tab.title}
                  tabClassName={(tab.index >= firstIndex) ? tab.tabClassName : `${tab.tabClassName} invisible`}
                >
                  {tab.children}
                </ReactBootstrap_Tab>
              )
            })
          }
          </ReactBootstrap_Tabs>
        </div>

      </div>
  )
}
  
export default Tabs