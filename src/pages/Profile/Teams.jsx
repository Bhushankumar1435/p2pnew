import React, { useState,useEffect } from 'react'
import { getData } from '../../api/protectedApi';
import moment from 'moment';
import ReactPaginate from 'react-paginate';

export default function Teams() {
    const [activeTab, setActiveTab] = useState('Directs');
    const [directList , setDirectList] = useState([])
    const [teamLevel , setTeamLevel] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [levelData, setLevelData] = useState([]);
    const limit = 5;
    const [levelCurrentPage , setLevelCurrentPage] = useState(1)
    const [levelPageCount, setLevelPageCount] = useState(0);
    useEffect(() => {
        getData('/user/direct', {})
        .then((res) => { setDirectList(res.data.data.directs), console.log('data ', res.data.data) })
        .catch((err) => console.error(err));

        console.log('NOW WE HAVE TO CALL DIRECTS API')
    }, []);

    const changeTab = ( tab = 'Directs') =>{
        setActiveTab(tab)
        if(tab  === 'LevelTeam'){
            // console.log('now we have to show level team')
             getData('/user/team', {})
            .then((res) => { setTeamLevel(res.data.data.team), console.log('data ', res.data.data) })
            .catch((err) => console.error(err));
        }
    }
    const showLevelTeam = ( page = 1)=>{
            // setCurrentLevel(level)
            let url = '/user/teamByLevel?level='+currentLevel
            console.log('current url is  ' , url ,  {limit : limit , page : page})
            setIsOpen(true)
            getData(url, {limit : limit , page : page})
            .then((res) => { setLevelData(res.data.data.teamMembers),
             setLevelPageCount(Math.ceil(res.data.data.count / limit)),    
            console.log('data ', res.data.data) })
            .catch((err) => console.error(err));
    }

    const handlePageClick = async (data) => {
        console.log( ' data is  '  , data)
        await setLevelCurrentPage(data.selected + 1)
        showLevelTeam(data.selected + 1);
    };

    const SetLevelTeam = async(level) => {
        await setCurrentLevel(level)
        setLevelCurrentPage(1)
        showLevelTeam(1)
    }
    return (

        <div className="max-w-[900px] mx-auto px-4 py-8">
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                {/* Modal Content */}
                    <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
                            >
                            &times;
                            </button>

                        <h2 className="text-2xl font-semibold mb-4">Team Level {currentLevel} </h2>
                         <div className="overflow-x-auto">
                            <table className="min-w-full text-left border-collapse">
                                <thead className='text-sm text-gray-500'>
                                    <tr className="border-b">
                                        <th className="px-4 py-2 font-medium">Sr No</th>
                                        <th className="px-4 py-2 font-medium">UserId</th>
                                        <th className="px-4 py-2 font-medium">Name</th>
                                        <th className="px-4 py-2 font-medium">Email</th>
                                        <th className="px-4 py-2 font-medium">Rank</th>
                                        <th className="px-4 py-2 font-medium">Register Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        levelData.length === 0 ? (
                                            <p>No Level Data found.</p>
                                        ) : (levelData.map((direct, index) => (
                                            <tr className="border-b text-sm text-gray-700" key={index}>
                                                <td className="px-4 py-2"> {index + 1 + ((levelCurrentPage - 1) * limit)}</td>
                                                <td className="px-4 py-2">{direct.inviteId.userId}</td>
                                                <td className="px-4 py-2">{direct.inviteId.name}</td>
                                                <td className="px-4 py-2">{direct.inviteId.email}</td>
                                                <td className="px-4 py-2">{direct.inviteId.rank}</td>
                                                <td className="px-4 py-2"> {moment(direct.inviteId.createdAt).format("DD/MM/YYYY hh:mm A")}</td>
                                            </tr>
                                            ))
                                        )}
                                   
                                </tbody>
                            </table>
                            <ReactPaginate
                                previousLabel="← Prev"
                                nextLabel="Next →"
                                breakLabel="..."
                                breakClassName="break-me"
                                pageCount={levelPageCount}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={3}
                                onPageChange={handlePageClick}
                                containerClassName="flex justify-center mt-6 space-x-2"
                                pageClassName="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
                                activeClassName="bg-blue-600 text-white"
                                previousClassName="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
                                nextClassName="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
                                disabledClassName="opacity-50 pointer-events-none"
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className="flex space-x-2 justify-center mb-6">
                <button
                    onClick={() => changeTab('Directs')}
                    className={`px-6 py-2 rounded-lg border ${activeTab === 'Directs'
                        ? 'bg-gray-200 text-black'
                        : 'bg-white text-gray-500 border-gray-300'
                        }`}
                >
                    Directs
                </button>
                <button
                    onClick={() => changeTab('LevelTeam')}
                    className={`px-6 py-2 rounded-lg border ${activeTab === 'LevelTeam'
                        ? 'bg-gray-200 text-black'
                        : 'bg-white text-gray-500 border-gray-300'
                        }`}
                >
                    Level Team
                </button>
            </div>


            <div className="overflow-x-auto">
                <table className={`min-w-full text-left border-collapse  ${activeTab != 'Directs' ? 'hidden' : ''}`}>
                    <thead className="text-sm text-gray-500">
                        <tr className="border-b">
                            <th className="px-4 py-2 font-medium">Sno</th>
                            <th className="px-4 py-2 font-medium">User ID</th>
                            <th className="px-4 py-2 font-medium">Name</th>
                            <th className="px-4 py-2 font-medium">Email</th>
                            <th className="px-4 py-2 font-medium">Package</th>
                        </tr>
                    </thead>
                    <tbody> 
                        {
                            directList.length === 0 ? (
                                <p>No Directs found.</p>
                            ) : (directList.map((direct, index) => (
                                 <tr className="border-b text-sm text-gray-700" key={index}>
                                    <td className="px-4 py-2">{index+1}</td>
                                    <td className="px-4 py-2">{direct.userId}</td>
                                    <td className="px-4 py-2">{direct.name}</td>
                                    <td className="px-4 py-2">{direct.email}</td>
                                    <td className="px-4 py-2">{direct.rank}</td>
                                </tr>
                                ))
                            )}
                        
                    </tbody>
                </table>

                <table className={`min-w-full text-left border-collapse  ${activeTab == 'Directs' ? 'hidden' : ''}`}>
                    <thead className="text-sm text-gray-500">
                        <tr className="border-b">
                            <th className="px-4 py-2 font-medium">Sno</th> 
                            <th className="px-4 py-2 font-medium">Level</th>
                            <th className="px-4 py-2 font-medium">Team</th>
                            <th className="px-4 py-2 font-medium">View</th>
                        </tr>
                    </thead>
                    <tbody> 
                         {
                            teamLevel.length === 0 ? (
                                <p>No Team found.</p>
                            ) : (teamLevel.map(( team,index) => (
                                 <tr className="border-b text-sm text-gray-700" key={'team'+index}>
                                    <td className="px-4 py-2">{index+1}</td>
                                    <td className="px-4 py-2">{team.level}</td>
                                    <td className="px-4 py-2">{team.member}</td> 
                                    <td className="px-4 py-2"> 
                                        <button
                                            onClick={() => {SetLevelTeam(team.level)} }
                                            className="px-2 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                                ))
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


