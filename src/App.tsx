import './App.css'
import React from 'react';
import { Theme, Flex, Box } from "@radix-ui/themes";
import Title from './components/Title';
import ThreeColumns from './components/ThreeColumns';
import Timeline from './components/TimeLine';
import BottomActions from './components/BottomActions';
import { themeConfig } from './utils';
import { initApp } from './utils/init';
import { useRecordStore } from './store';
import AnimatedNumber from './components/AnimatedNumber';
import "@radix-ui/themes/styles.css";

function App() {
  React.useEffect(() => {
    initApp();
  }, []);
  const records = useRecordStore((state) => state.records);
  const activeDate = useRecordStore((state) => state.activeDate);
  const getToday = () => new Date().toISOString().split('T')[0];

  // 计算当前日期总热量
  const activeCalories = React.useMemo(() => {
    const dateRecords = records.filter((r) => r.eatDate === activeDate);
    return dateRecords.reduce((acc, record) => acc + record.content.nutrients.calories, 0);
  }, [records, activeDate]);

  const isToday = activeDate === getToday();

  return (
    <Theme accentColor={themeConfig.accentColor}>
      <Flex direction="column" className='bg-[var(--accent-surface)] h-[100vh] p-4 pb-0 gap-4'>
        <Box>
          <Flex direction="row" gap="2">
            <Box width={"70%"}>
              <ThreeColumns />
            </Box>
            <Box width={"30%"}>
              <Title title={<AnimatedNumber value={Math.round(activeCalories)} />} subTitle={isToday ? '今日摄入' : activeDate.slice(5)} />
            </Box>
          </Flex>
        </Box>
        <Box className='flex-1 overflow-scroll pb-20'>
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
