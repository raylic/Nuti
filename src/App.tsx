import './App.css'
import React from 'react';
import { Theme, Flex, Box } from "@radix-ui/themes";
import Title from './components/Title';
import ThreeColumns from './components/ThreeColumns';
import Timeline from './components/TimeLine';
import BottomActions from './components/BottomActions';
import { themeConfig } from './utils';
import { useRecordStore } from './store';
import "@radix-ui/themes/styles.css";

function App() {
  const records = useRecordStore((state) => state.records);

  // 计算今日总热量
  const todayCalories = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter((r) => r.eatDate === today);
    return todayRecords.reduce((acc, record) => acc + record.content.nutrients.calories, 0);
  }, [records]);

  return (
    <Theme accentColor={themeConfig.accentColor}>
      <Flex direction="column" className='bg-[var(--accent-surface)] h-[100vh] p-4 pb-0 gap-4'>
        <Box>
          <Flex direction="row" gap="2">
            <Box width={"70%"}>
              <ThreeColumns />
            </Box>
            <Box width={"30%"}>
              <Title title={String(Math.round(todayCalories))} subTitle="今日摄入" />
            </Box>
          </Flex>
        </Box>
        <Box className='flex-1 overflow-scroll'>
          <Timeline />
        </Box>
      </Flex>
      <BottomActions
        onMainClick={() => console.log('main')}
        onLeftClick={() => console.log('left')}
        onRightClick={() => console.log('right')}
      />
    </Theme>
  )
}

export default App
