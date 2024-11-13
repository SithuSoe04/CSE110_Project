import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';

export default function FAQ() {
  return (
    <Box>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{fontWeight: '600'}}
        >
          What is TritonCricles?
        </AccordionSummary>
        <AccordionDetails>
          TritonCircles is an all-in-one place for students to get involved with student organizations at UC San Diego.  
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
          sx={{fontWeight: '600'}}
        >
          Which student organizations can be part of TritonCircles?
        </AccordionSummary>
        <AccordionDetails>
          Any CSI-affiliated student organizations at UC San Diego can be part of TritonCircles.
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
          sx={{fontWeight: '600'}}
        >
          Are there any restrictions on which student organizations can join TritonCircles?
        </AccordionSummary>
        <AccordionDetails>
          As long as you are a CSI-affiliated student organization at UC San Diego, you can be part of TritonCircles. We currently do not support any other schools.
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
          sx={{fontWeight: '600'}}
        >
          Who developed TritonCircles?
        </AccordionSummary>
        <AccordionDetails>
          TritonCircles was developed by a group of students working on a class project together.
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}