import { useColorMode, IconButton } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const ColorModeToggle = () => {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<IconButton
			icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
			onClick={toggleColorMode}
			variant='ghost'
			ml={{ base: '-1' }}
		/>
	);
};

export default ColorModeToggle;
