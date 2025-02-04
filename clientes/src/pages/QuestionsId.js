import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import Sidebar from '../components/Sidebar';
import SideCartegory from '../components/SideCartegory';
import { format, formatDistanceToNow } from 'date-fns';

const QuestionsId = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const questionId = searchParams.get('id');
  // const [error, setError] = useState(null);
  const [questionDetails, setQuestionDetails] = useState(undefined);
  const [answersDetails, setAnswersDetails] = useState(undefined);
  const [newAnswer, setNewAnswer] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentsDetails, setCommentsDetails] = useState(undefined);
  const navigate = useNavigate();

  const apiUrl =
    'http://ec2-52-79-212-94.ap-northeast-2.compute.amazonaws.com:8080';
  const Authorization = localStorage.getItem('accessToken');

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`${apiUrl}/questions/auth/login`);
  //       // Handle the successful response
  //       console.log(response);
  //     } catch (error) {
  //       console.error('An error occurred:', error);
  //       // Handle the error case (e.g., show a user-friendly message)
  //     }
  //   };

  //   fetchData();
  // }, []);

  // const questionDetails = [
  //   {
  //     id: 1,
  //     title: '제목',
  //     bodyExpecting: '기대하는 바',
  //     bodyProblem: '문제점',
  //     authorId: 'pepe the frog',
  //     views: 3,
  //     createdAt: '2023-08-16T23:19:49.0995',
  //     modifiedAt: '2023-08-16T23:19:49.0995',
  //   },
  // ];

  // const answersDetails = [
  //   {
  //     answerId: 1,
  //     content: '답변조회테스트1',
  //     questionId: 1,
  //     createdAt: '2023-08-16T23:19:49.0995',
  //     modifiedAt: '2023-08-16T23:19:49.0995',
  //   },
  //   {
  //     answerId: 2,
  //     content: '답변조회테스트2',
  //     questionId: 1,
  //     createdAt: '2023-08-16T23:19:49.0995',
  //     modifiedAt: '2023-08-16T23:19:49.0995',
  //   },
  // ];

  // const commentsDetails = [
  //   {
  //     answerId: 1,
  //     content: '댓글조회테스트1-1',
  //     commentId: 1,
  //     createdAt: '2023-08-16T23:19:49.0995',
  //     modifiedAt: '2023-08-16T23:19:49.0995',
  //     userId: 'pepe the frog',
  //   },
  //   {
  //     answerId: 1,
  //     content: '댓글조회테스트1-2',
  //     commentId: 2,
  //     createdAt: '2023-08-16T23:19:49.0995',
  //     modifiedAt: '2023-08-16T23:19:49.0995',
  //   },
  //   {
  //     answerId: 2,
  //     content: '댓글조회테스트2-1',
  //     commentId: 1,
  //     createdAt: '2023-08-16T23:19:49.0995',
  //     modifiedAt: '2023-08-16T23:19:49.0995',
  //   },
  //   {
  //     answerId: 2,
  //     content: '댓글조회테스트2-2',
  //     commentId: 1,
  //     createdAt: '2023-08-16T23:19:49.0995',
  //     modifiedAt: '2023-08-16T23:19:49.0995',
  //   },
  // ];

  useEffect(() => {
    let question = undefined;
    if (questionDetails) {
      const questionBody = `${questionDetails.bodyProblem}\n\n${questionDetails.bodyExpecting}`;
      question = Editor.factory({
        el: document.querySelector('#question'),
        initialValue: questionBody,
        height: 'auto',
        viewer: true,
      });

      return () => {
        question.destroy();
      };
    }
  }, []); // questionsDetails가 바뀔 때마다 editor를 생성하면 안되기 때문에 빈 배열을 넣어줌?

  useEffect(() => {
    axios
      .get(`${apiUrl}/questions/${questionId}`)
      .then((response) => {
        setQuestionDetails(response.data);
        console.log(response);
      })
      .catch((error) => {
        console.error('Error fetching question details:', error);
        //setError('An error occurred while fetching data.');
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${apiUrl}/question/${questionId}/answers`)
      .then((response) => {
        const fetchedAnswers = response.data.map((answer) => {
          const userEmail = answer.userEmail;
          const userId = userEmail.split('@')[0];

          const comments = answer.comments.map((comment) => {
            const commentUserEmail = comment.userEmail;
            const commentUserId = commentUserEmail.split('@')[0];
            return {
              ...comment,
              userId: commentUserId,
            };
          });

          return {
            ...answer,
            userId: userId,
            comments: comments,
          };
        });

        setAnswersDetails(fetchedAnswers);
        console.log('Fetched answers:', fetchedAnswers);

        // setCommentsDetails(fetchedAnswers.comments);
        // console.log('Fetched comments:', fetchedAnswers.comments);

        const allComments = fetchedAnswers.flatMap((answer) => answer.comments);

        setCommentsDetails(allComments);
        console.log('All comments:', allComments);
      })
      .catch((error) => {
        console.error('Error fetching answers:', error);
      });
  }, []);

  // useEffect(() => {
  //   axios
  //     .get(`${apiUrl}/question/${questionId}/answers`)
  //     .then((response) => {
  //       const fetchedAnswers = response.data.map((answer) => {
  //         const userEmail = answer.userEmail;
  //         const userId = userEmail.split('@')[0];

  //         return {
  //           ...answer,
  //           userId: userId,
  //         };
  //       });
  //       // const comments = response.data.comments.map((comment) => {
  //       //   const userEmail = comment.userEmail;
  //       //   const userId = userEmail.split('@')[0];
  //       //   return {
  //       //     ...comment,
  //       //     userId: userId,
  //       //   };
  //       // });

  //       const comments = response.data.comments;

  //       setAnswersDetails(fetchedAnswers);
  //       console.log('Fetched answers:', fetchedAnswers);
  //       console.log('Fetched comments:', comments);
  //       setCommentsDetails(comments);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching answers:', error);
  //     });
  // }, []);

  const handleNewAnswerSubmit = () => {
    // Create a new answer
    const dataToSend = {
      content: newAnswer,
      headers: {
        Authorization: Authorization,
      },
    };

    axios
      .post(`${apiUrl}/question/${questionId}/answer`, dataToSend)
      .then((response) => {
        console.log('Successfully submitted answer:', response);
      })
      .catch((error) => {
        console.error('Error submitting answer:', error);
      });
    setNewAnswer('');
  };

  const handleDelete = (type, id) => {
    const config = {
      headers: {
        Authorization: Authorization,
      },
    };

    let deleteEndpoint;

    if (type === 'question') {
      deleteEndpoint = `${apiUrl}/questions/${id}`;
    } else if (type === 'answer') {
      deleteEndpoint = `${apiUrl}/question/answer/${id}`;
    } else if (type === 'comment') {
      deleteEndpoint = `${apiUrl}/answer/comment/${id}`;
    }

    axios
      .delete(deleteEndpoint, config)
      .then((response) => {
        console.log(`Successfully deleted ${type}:`, response);
        // Navigate to appropriate page
        if (type === 'question') {
          navigate('/home');
        } else {
          // Handle navigation for answers and comments as needed
        }
      })
      .catch((error) => {
        console.error(`Error deleting ${type}:`, error);
      });
  };

  const handleCommentAdd = (answerId) => {
    if (newComment.trim() === '') {
      return; // Don't add empty comments
    }

    const dataToSend = {
      content: newComment,
    };

    axios
      .post(`${apiUrl}/answer/${answerId}/comment`, dataToSend, {
        headers: {
          Authorization: Authorization,
        },
      })
      .then((response) => {
        console.log('Comment added:', response);
        // Optionally, you can update the comments list with the new comment here
        setNewComment('');
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  };

  const handleAnswerEdit = () => {};

  return (
    <div className="flex justify-center py-[2%] w-full">
      <div className="py-4">
        <SideCartegory />
      </div>
      <div className="flex flex-col justify-center pt-14 pl-6 mb-1.5 divide-y divide-slate-200 w-4/6 ">
        <div className="">
          <div className="flex justify-between">
            {questionDetails && (
              <div className="mb-2 text-2xl">
                {questionDetails.title && questionDetails.title}
              </div>
            )}
            <div className="text-white text-sm cursor-pointer">
              {/* 로그인 정보 받으면 수정/삭제 버튼 보이게 */}
              <Link to={`/questions/ask?id=${questionId}`}>
                <button className=" p-2 mt-6 bg-[#0A95FF] rounded-md hover:bg-[#0A95FF]/50">
                  Edit
                </button>
              </Link>
              <button
                onClick={() => handleDelete('question', questionId)}
                className="p-2 mt-6 ml-1 bg-red-700/80 hover:bg-red-700/20 rounded-md"
              >
                Delete
              </button>
              <Link to="/questions/ask">
                <button className="p-2 ml-1 bg-[#0A95FF] rounded-md hover:bg-[#0A95FF]/50">
                  Ask Question
                </button>
              </Link>
            </div>
          </div>{' '}
          {questionDetails && (
            <div className="flex mb-2">
              <div className="mr-4 text-xs font-light">
                Asked {formatDistanceToNow(new Date(questionDetails.createdAt))}{' '}
                ago
              </div>
              <div className="mr-4 text-xs font-light">
                Modified{' '}
                {formatDistanceToNow(new Date(questionDetails.modifiedAt))} ago
              </div>
              <div className="text-xs font-light">
                Viewed{` ${questionDetails.views}`}
              </div>
            </div>
          )}
        </div>
        {questionDetails && (
          <div className="flex justify-between ">
            <div className="w-3/4">
              <div className="flex grow py-4 min-h-[12%]">
                <div className="flex flex-col items-center pr-4 w-14">
                  <button className="p-3 mb-2 border rounded-full hover:bg-orange-500/20 cursor-not-allowed">
                    <img
                      src="/images/vote-up.png"
                      alt="vote-up"
                      className="h-2 w-4"
                    />
                  </button>
                  <div className="flex font-semibold mb-2">0</div>
                  <button className="p-3 mb-2 border rounded-full hover:bg-orange-500/20 cursor-not-allowed">
                    <img
                      src="/images/vote-down.png"
                      alt="vote-down"
                      className="h-2 w-4"
                    />
                  </button>
                  <button>
                    <img
                      src="/images/unbookmarked.png"
                      alt="unbookmarked"
                      className="h-4 w-3"
                    />
                  </button>
                </div>
                <div className="pr-4 w-full">
                  <div className="pb-2">
                    {/* question viewer below */}
                    <div
                      id="question"
                      className="mb-4 border rounded-md p-3 bg-white"
                    >{`${questionDetails.bodyExpecting}\n\n${questionDetails.bodyProblem}`}</div>
                  </div>
                  {/* <ul className="relative">
                  <li className="inline-block space-x-1 p-1.5 bg-[#E1ECF4] text-[#39739D] rounded-md text-xs">
                    tag
                  </li>
                </ul> */}
                  <div className="flex justify-end">
                    <div className="my-4 p-1.5 bg-[#E1ECF4] rounded-md text-xs">
                      <div className="text-[#6A737C]">
                        Asked{' '}
                        {format(
                          new Date(questionDetails.createdAt),
                          'MMM d, yyyy',
                        )}{' '}
                        at{' '}
                        {format(new Date(questionDetails.createdAt), 'HH:mm')}
                      </div>
                      <div className="flex pt-1">
                        <img
                          src="https://www.freeiconspng.com/thumbs/pepe-png/hd-pepe-png-transparent-background-4.png"
                          alt="user"
                          className="h-8 w-8"
                        />
                        <div className="text-[#0074CC] ml-2.5">
                          {questionDetails.authorId}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <div>
                  {answersDetails && (
                    <div className="text-xl">{`${answersDetails.length} Answer${
                      answersDetails.length !== 1 ? 's' : ''
                    }`}</div>
                  )}
                </div>
                {answersDetails &&
                  answersDetails.map((answer) => (
                    <div className="flex py-4 border-b" key={answer.answerId}>
                      <div className="flex flex-col items-center pr-4 w-14">
                        <button className="p-3 mb-2 border rounded-full hover:bg-orange-500/20 cursor-not-allowed">
                          <img
                            src="/images/vote-up.png"
                            alt="vote-up"
                            className="h-2 w-4"
                          />
                        </button>
                        <div className="flex font-semibold mb-2">0</div>
                        <button className="p-3 mb-2 border rounded-full hover:bg-orange-500/20 cursor-not-allowed">
                          <img
                            src="/images/vote-down.png"
                            alt="vote-down"
                            className="h-2 w-4"
                          />
                        </button>
                        <button className="mb-2">
                          <img
                            src="/images/unbookmarked.png"
                            alt="unbookmarked"
                            className="h-4 w-3"
                          />
                        </button>
                        {/* <button>
                      <img
                        src="/images/selected.png"
                        alt="selected"
                        className="h-6 w-6"
                      />
                    </button> */}
                      </div>
                      <div className="pr-4 w-full">
                        <div className="pb-6 grow">
                          {/* answer viewer below */}
                          <div className="mb-4 border rounded-md p-3 bg-white text-sm font-light">
                            {answer.content}
                          </div>
                        </div>
                        {/* <ul className="relative">
                    <li className="inline-block space-x-1 p-1.5 bg-[#E1ECF4] text-[#39739D] rounded-md text-xs">
                      tag
                    </li>
                  </ul> */}
                        <div className="flex justify-between">
                          <div className="flex items-end mb-4 text-[#6A737C] text-sm">
                            <button onClick={handleAnswerEdit} className="mr-2">
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDelete('answer', answer.answerId)
                              }
                            >
                              Delete
                            </button>
                          </div>
                          <div className="  my-4 p-1.5 text-[#39739D] text-xs">
                            <div className="text-[#6A737C]">
                              {format(
                                new Date(answer.createdAt),
                                "'answered' MMM d, yyyy 'at' HH:mm",
                              )}
                            </div>
                            <div className="flex pt-1">
                              <img
                                src="https://e7.pngegg.com/pngimages/281/279/png-clipart-pepe-the-frog-batman-internet-meme-pepe-frog-comics-mammal-thumbnail.png"
                                alt="user"
                                className="h-8 w-8"
                              />
                              <div className="text-[#0074CC] ml-2.5">
                                {answer.userId}
                              </div>
                            </div>
                          </div>
                        </div>
                        {commentsDetails &&
                          commentsDetails
                            // .filter(
                            //   (comment) => comment.answerId === answer.answerId,
                            // )
                            .map((comment) => (
                              <div key={comment.commentId}>
                                <div
                                  className="w-full border-t"
                                  //key={comment.commentId}
                                >
                                  <div className="flex py-[1.5%] mr-[.5%] ml-[6%] text-xs">
                                    <span>{comment.content}&nbsp;</span>
                                    <div className="mx-1 text-[#0074CC] text-xs">
                                      -{comment.userId}&nbsp;
                                    </div>
                                    <div className="text-[#6A737C]">
                                      {format(
                                        new Date(comment.createdAt),
                                        "'answered' MMM d, yyyy 'at' HH:mm",
                                      )}
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleDelete(
                                          'comment',
                                          comment.commentId,
                                        )
                                      }
                                      className="flex mx-1 text-[7px]"
                                    >
                                      &#10060;
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        {Authorization && (
                          <div className="flex">
                            <input
                              placeholder="Add a comment"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="w-full border rounded-md focus:outline-none focus:border-sky-50 focus:ring-4 pl-2"
                            />
                            <button
                              onClick={() => handleCommentAdd(answer.answerId)}
                              className="flex p-2 ml-[.5%] bg-[#0A95FF]/80 text-white rounded-md text-sm cursor-pointer hover:bg-[#0A95FF]/50"
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                <div></div>
                {Authorization && (
                  <div className="">
                    <h2 className="pt-5 mb-2 text-2xl">Your Answer</h2>
                    <textarea
                      type="text"
                      //id="editor"
                      className="pb-[30%] pt-[2%] px-[2%] w-full h-auto border rounded-md focus:outline-none focus:border-sky-50 focus:ring-4"
                      placeholder="Please be sure to answer the question. Provide details and share your research!"
                      onChange={(event) => setNewAnswer(event.target.value)}
                      value={newAnswer}
                    />
                    <button
                      onClick={handleNewAnswerSubmit}
                      className="flex p-2 mt-3 bg-[#0A95FF] text-white rounded-md text-sm cursor-pointer hover:bg-[#0A95FF]/50"
                    >
                      Post Your Answer
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex py-4 pl-4 w-[30%]">
              <Sidebar />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsId;
