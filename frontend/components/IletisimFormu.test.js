import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';


beforeEach(() => {
    render(<IletisimFormu/>);
});

test('hata olmadan render ediliyor', () => {

});

test('iletişim formu headerı render ediliyor', () => {
    const heading = screen.getByRole('heading');
    expect(heading.textContent).toBe("İletişim Formu");
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {

    const fieldName = screen.getByPlaceholderText("İlhan");
    userEvent.type(fieldName , "Name");

    const errorMessages = await screen.getAllByTestId("error");
    expect(errorMessages.length).toBe(1);


    expect(errorMessages[0].textContent).toBe("Hata: ad en az 5 karakter olmalıdır.");

});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    
    userEvent.click(screen.getByText("Gönder"));
    const errorMessages = await screen.getAllByTestId("error");
    expect(errorMessages.length).toBe(3);
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    userEvent.type(screen.getByPlaceholderText("İlhan"), "Name1");
    userEvent.type(screen.getByPlaceholderText("Mansız"), "LastName1");
    userEvent.click(screen.getByText("Gönder"));

    const errorMessages = await screen.getAllByTestId("error");

    expect(errorMessages.length).toBe(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {

    userEvent.type(screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"), "nonvalidemail");


    const errorMessage = await screen.getByTestId("error");

    expect(errorMessage.textContent).toBe("Hata: email geçerli bir email adresi olmalıdır.");
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    userEvent.type(screen.getByPlaceholderText("İlhan"), "Name1");
    userEvent.type(screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"), "yüzyılıngolcüsü@hotmail.com");

    userEvent.click(screen.getByText("Gönder"));

    const errorMessage = await screen.getByTestId("error");
    expect(errorMessage.textContent).toBe("Hata: soyad gereklidir.");
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    userEvent.type(screen.getByPlaceholderText("İlhan"), "Name1");
    userEvent.type(screen.getByPlaceholderText("Mansız"), "LastName1");
    userEvent.type(screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"), "yüzyılıngolcüsü@hotmail.com");

    userEvent.click(screen.getByText("Gönder"));

    const errorMessages = await screen.queryAllByTestId("error");
    expect(errorMessages.length).toBe(0);
});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {

    const formData = {
        name: "Name1",
        lastName: "LastName1",
        email: "yüzyılıngolcüsü@hotmail.com",
        msg: "Some Message"
    };

    userEvent.type(screen.getByPlaceholderText("İlhan"), formData.name);
    userEvent.type(screen.getByPlaceholderText("Mansız"), formData.lastName);
    userEvent.type(screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"), formData.email);
    userEvent.type(screen.getByLabelText("Mesaj"), formData.msg);

    userEvent.click(screen.getByText("Gönder"));
    
    const name = await screen.getByTestId("firstnameDisplay");
    const lastName = await screen.getByTestId("lastnameDisplay");
    const email = await screen.getByTestId("emailDisplay");
    const msg = await screen.getByTestId("messageDisplay");


    expect(name).toHaveTextContent(formData.name);
    expect(lastName).toHaveTextContent(formData.lastName);
    expect(email).toHaveTextContent(formData.email);
    expect(msg).toHaveTextContent(formData.msg);
});
