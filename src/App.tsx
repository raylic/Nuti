import './App.css'
import { Theme, Flex, Box } from "@radix-ui/themes";
import Title from './components/Title';
import ThreeColumns from './components/ThreeColumns';
import Timeline from './components/Timeline';
import BottomActions from './components/BottomActions';
import "@radix-ui/themes/styles.css";

function App() {
  return (
    <Theme accentColor="tomato">
      <Flex direction="column" className='bg-[var(--accent-surface)] h-[100vh] p-4 pb-0 gap-4'>
        <Box>
          <Flex direction="row" gap="2">
            <Box width={"70%"}>
              <ThreeColumns />
            </Box>
            <Box width={"30%"}>
              <Title title="1982" subTitle="今日摄入" />
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
