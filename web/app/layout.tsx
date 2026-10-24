import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Quellight · A little continuity',description:'Local synthetic Companion and Steward proof'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
